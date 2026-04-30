import { prisma } from './prisma'

const timers = new Map()

export async function reserveNumbersFIFO(raffleId, numbers, customerId, durationMinutes = 5) {
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

  await prisma.raffleNumber.updateMany({
    where: {
      raffleId,
      status: 'RESERVED',
      reservedAt: { lt: fiveMinutesAgo }
    },
    data: {
      status: 'AVAILABLE',
      customerId: null,
      reservedAt: null
    }
  })

  const existingReserved = await prisma.raffleNumber.findMany({
    where: {
      raffleId,
      number: { in: numbers },
      status: { in: ['RESERVED', 'PAID'] }
    }
  })

  if (existingReserved.length > 0) {
    return {
      success: false,
      error: 'Alguns números já estão reservados ou pagos',
      reservedNumbers: existingReserved.map(n => n.number)
    }
  }

  await prisma.raffleNumber.updateMany({
    where: {
      raffleId,
      number: { in: numbers }
    },
    data: {
      status: 'RESERVED',
      customerId,
      reservedAt: now
    }
  })

  const timerKey = `${raffleId}-${numbers.join(',')}`
  
  if (timers.has(timerKey)) {
    clearTimeout(timers.get(timerKey))
  }

  const timer = setTimeout(async () => {
    await prisma.raffleNumber.updateMany({
      where: {
        raffleId,
        number: { in: numbers },
        status: 'RESERVED'
      },
      data: {
        status: 'AVAILABLE',
        customerId: null,
        reservedAt: null
      }
    })
    timers.delete(timerKey)
  }, durationMinutes * 60 * 1000)

  timers.set(timerKey, timer)

  return {
    success: true,
    reservedAt: now,
    expiresAt: new Date(now.getTime() + durationMinutes * 60 * 1000)
  }
}

export async function cleanupExpiredReservations() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

  const result = await prisma.raffleNumber.updateMany({
    where: {
      status: 'RESERVED',
      reservedAt: { lt: fiveMinutesAgo }
    },
    data: {
      status: 'AVAILABLE',
      customerId: null,
      reservedAt: null
    }
  })

  return result.count
}
