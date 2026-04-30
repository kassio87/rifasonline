import { prisma } from './prisma'

export async function calculateBilling(subscriptionId) {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      plan: { include: { limits: true } },
      clientAdmin: true
    }
  })

  if (!subscription) {
    throw new Error('Assinatura não encontrada')
  }

  if (subscription.plan.type === 'FIXED') {
    return {
      amount: subscription.plan.fixedPrice,
      type: 'FIXED',
      description: `Plano Fixo - ${subscription.plan.name}`
    }
  }

  const salesCount = subscription.salesCount || 0
  const limits = subscription.plan.limits.sort((a, b) => a.minSales - b.minSales)

  let applicableLimit = limits.find(l => 
    salesCount >= l.minSales && salesCount <= l.maxSales
  )

  if (!applicableLimit && limits.length > 0) {
    applicableLimit = limits[limits.length - 1]
  }

  if (!applicableLimit) {
    throw new Error('Nenhum limite configurado para o plano recorrente')
  }

  const amount = (salesCount * applicableLimit.percentage) / 100

  return {
    amount,
    type: 'RECURRENT',
    salesCount,
    percentage: applicableLimit.percentage,
    description: `Plano Recorrente - ${salesCount} vendas x ${applicableLimit.percentage}%`
  }
}

export async function processBiweeklyBilling(subscriptionId) {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId }
  })

  if (!subscription || subscription.status !== 'ACTIVE') {
    return null
  }

  const now = new Date()
  const lastBilling = subscription.lastBilling || subscription.startDate

  const daysSinceLastBilling = (now - lastBilling) / (1000 * 60 * 60 * 24)

  if (daysSinceLastBilling < 14) {
    return null
  }

  const billing = await calculateBilling(subscriptionId)

  const paymentOrder = await prisma.paymentOrder.create({
    data: {
      clientAdminId: subscription.clientAdminId,
      amount: billing.amount,
      description: `Cobrança Quinzenal - ${billing.description}`,
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { lastBilling: now }
  })

  return paymentOrder
}

export async function resetMonthlySales(subscriptionId) {
  const now = new Date()
  const lastReset = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId }
  })

  if (!subscription) return

  const shouldReset = now.getMonth() !== new Date(subscription.lastBilling).getMonth()

  if (shouldReset) {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { salesCount: 0 }
    })
  }
}

export async function incrementSalesCount(clientAdminId) {
  const subscription = await prisma.subscription.findFirst({
    where: { clientAdminId }
  })

  if (!subscription) return

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { salesCount: subscription.salesCount + 1 }
  })
}
