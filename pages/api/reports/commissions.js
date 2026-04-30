import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'
import { calculateBilling } from '../../../lib/billing'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    if (user.role !== 'SYSTEM_ADMIN' && user.role !== 'CLIENT_ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    let subscriptions = []

    if (user.role === 'SYSTEM_ADMIN') {
      subscriptions = await prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        include: {
          clientAdmin: { include: { user: true } },
          plan: { include: { limits: true } },
          paymentOrders: {
            where: { status: 'PAID' }
          }
        }
      })
    } else {
      const clientAdmin = await prisma.clientAdmin.findUnique({
        where: { userId: user.id }
      })
      
      if (clientAdmin) {
        subscriptions = await prisma.subscription.findMany({
          where: { clientAdminId: clientAdmin.id, status: 'ACTIVE' },
          include: {
            clientAdmin: { include: { user: true } },
            plan: { include: { limits: true } },
            paymentOrders: {
              where: { status: 'PAID' }
            }
          }
        })
      }
    }

    const commissions = []

    for (const subscription of subscriptions) {
      try {
        const billing = await calculateBilling(subscription.id)
        
        const totalPaid = subscription.paymentOrders.reduce((sum, po) => sum + po.amount, 0)
        
        commissions.push({
          subscriptionId: subscription.id,
          clientAdmin: {
            id: subscription.clientAdmin.id,
            companyName: subscription.clientAdmin.companyName,
            user: subscription.clientAdmin.user
          },
          plan: subscription.plan,
          salesCount: subscription.salesCount,
          currentBilling: billing,
          totalPaid,
          status: subscription.status,
          lastBilling: subscription.lastBilling
        })
      } catch (error) {
        console.error(`Erro ao calcular comissão para assinatura ${subscription.id}:`, error)
      }
    }

    const totalCommissions = commissions.reduce((sum, c) => sum + c.currentBilling.amount, 0)

    return res.status(200).json({
      commissions,
      summary: {
        totalSubscriptions: subscriptions.length,
        totalCommissions,
        paidSubscriptions: commissions.filter(c => c.totalPaid > 0).length
      }
    })
  } catch (error) {
    console.error('Erro ao calcular comissões:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
