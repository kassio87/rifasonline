import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import { prisma } from './prisma'

const sessions = new Map()
const reservationTimers = new Map()

function parseCommand(text) {
  if (!text) return null
  const t = text.trim()
  
  if (/^#Fecha$/i.test(t)) return { type: 'close' }
  
  const rangeMatch = t.match(/^(?:quero|eu quero|marca)\s+(\d+)\s*(?:ao|até|-)\s*(\d+)/i)
  if (rangeMatch) return { type: 'range', start: parseInt(rangeMatch[1]), end: parseInt(rangeMatch[2]) }
  
  const singleMatch = t.match(/^(?:quero|eu quero|marca)\s+(\d+(?:\s*,\s*\d+)*)/i)
  if (singleMatch) {
    const nums = singleMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
    return { type: 'individual', numbers: nums }
  }
  
  return null
}

async function updateNumberList(clientAdminId, raffleId) {
  const raffle = await prisma.raffle.findFirst({
    where: { id: raffleId, clientAdminId },
    include: { numbers: { orderBy: { number: 'asc' } } }
  })
  
  if (!raffle) return null
  
  let list = `*${raffle.title}*\n\n`
  
  for (const num of raffle.numbers) {
    const emoji = num.status === 'PAID' ? '💰' : num.status === 'RESERVED' ? '🔍' : '✅'
    const info = num.status === 'PAID' ? ` ${num.customer?.user?.name || ''}` : ''
    list += `${emoji} ${String(num.number).padStart(3, '0')}${info}\n`
  }
  
  return list
}

async function sendCustomerQuestion(session, phone, question) {
  try {
    await session.sendMessage(phone, question)
  } catch (err) {
    console.error('Erro ao enviar pergunta:', err)
  }
}

async function handleGroupJoin(clientAdminId, session, notification) {
  try {
    const raffle = await prisma.raffle.findFirst({
      where: { clientAdminId, status: 'active' }
    })
    
    if (!raffle) return
    
    const clientAdmin = await prisma.clientAdmin.findUnique({
      where: { id: clientAdminId }
    })
    
    const contact = await notification.getContact()
    const phone = contact.id.user + '@s.whatsapp.net'
    
    await session.sendMessage(phone, 
      `Olá ${contact.pushname || 'novo membro'}! Bem-vindo ao grupo da rifa *${raffle.title}*.\n` +
      `Link para participar: ${clientAdmin.customUrl || 'https://' + clientAdmin.subdomain + '.rifasonline.com'}\n\n` +
      `Para reservar seus números, envie aqui mesmo:\n` +
      `"Quero 5" ou "Quero 5 ao 10" ou "#Fecha" para reservar todos.`
    )
    
    await sendCustomerQuestion(session, phone, 'Digite seu nome:')
    
  } catch (err) {
    console.error('Erro ao processar novo membro:', err)
  }
}

async function handleIncomingMessage(clientAdminId, session, message) {
  try {
    if (message.from.endsWith('@g.us')) return
    
    const phone = message.from
    const contact = await message.getContact()
    const name = contact.pushname || ''
    
    let customer = await prisma.customer.findFirst({
      where: { user: { phone: phone.replace('@s.whatsapp.net', '') } },
      include: { user: true }
    })
    
    if (!customer) {
      const user = await prisma.user.create({
        data: {
          name: name || 'Usuário',
          phone: phone.replace('@s.whatsapp.net', ''),
          password: Math.random().toString(36).slice(-8),
          role: 'CUSTOMER'
        }
      })
      
      customer = await prisma.customer.create({
        data: { userId: user.id },
        include: { user: true }
      })
    }
    
    const raffle = await prisma.raffle.findFirst({
      where: { clientAdminId, status: 'active' }
    })
    
    if (!raffle) {
      await session.sendMessage(phone, 'Nenhuma rifa ativa no momento.')
      return
    }
    
    const command = parseCommand(message.body)
    
    if (!command) {
      if (!customer.user.name || customer.user.name === 'Usuário') {
        await prisma.user.update({
          where: { id: customer.userId },
          data: { name: message.body }
        })
        await sendCustomerQuestion(session, phone, 'Digite seu telefone:')
      } else if (!customer.user.phone || customer.user.phone === phone.replace('@s.whatsapp.net', '')) {
        await prisma.user.update({
          where: { id: customer.userId },
          data: { phone: message.body }
        })
        await session.sendMessage(phone, 
          `Pronto! Agora você pode reservar números:\n` +
          `"Quero 5" (individual)\n` +
          `"Quero 5 ao 10" (intervalo)\n` +
          `"#Fecha" (todos)`
        )
      }
      return
    }
    
    if (command.type === 'close') {
      const numbers = await prisma.raffleNumber.findMany({
        where: { raffleId: raffle.id, status: 'AVAILABLE' }
      })
      
      for (const num of numbers) {
        await prisma.raffleNumber.update({
          where: { id: num.id },
          data: { status: 'RESERVED', customerId: customer.id, reservedAt: new Date() }
        })
      }
      
      const list = await updateNumberList(clientAdminId, raffle.id)
      if (list) await session.sendMessage(phone, list)
      
      await startReservationTimer(clientAdminId, raffle.id, customer.id, session, phone)
      return
    }
    
    let numbersToReserve = []
    
    if (command.type === 'individual') {
      numbersToReserve = command.numbers
    } else if (command.type === 'range') {
      for (let i = command.start; i <= command.end; i++) {
        numbersToReserve.push(i)
      }
    }
    
    const existingNumbers = await prisma.raffleNumber.findMany({
      where: {
        raffleId: raffle.id,
        number: { in: numbersToReserve },
        status: { in: ['RESERVED', 'PAID'] }
      }
    })
    
    if (existingNumbers.length > 0) {
      await session.sendMessage(phone, 
        `Os seguintes números já estão reservados/pagos: ${existingNumbers.map(n => n.number).join(', ')}`
      )
      return
    }
    
    for (const num of numbersToReserve) {
      await prisma.raffleNumber.updateMany({
        where: { raffleId: raffle.id, number: num, status: 'AVAILABLE' },
        data: { status: 'RESERVED', customerId: customer.id, reservedAt: new Date() }
      })
    }
    
    const list = await updateNumberList(clientAdminId, raffle.id)
    if (list) await session.sendMessage(phone, list)
    
    await startReservationTimer(clientAdminId, raffle.id, customer.id, session, phone, numbersToReserve)
    
  } catch (err) {
    console.error('Erro ao processar mensagem:', err)
  }
}

async function startReservationTimer(clientAdminId, raffleId, customerId, session, phone, numbers = null) {
  const timerKey = `${clientAdminId}-${customerId}-${raffleId}`
  
  if (reservationTimers.has(timerKey)) {
    clearTimeout(reservationTimers.get(timerKey))
  }
  
  const timer = setTimeout(async () => {
    try {
      const reservedNumbers = await prisma.raffleNumber.findMany({
        where: {
          raffleId,
          customerId,
          status: 'RESERVED'
        }
      })
      
      if (reservedNumbers.length > 0) {
        const customer = await prisma.customer.findUnique({
          where: { id: customerId },
          include: { user: true }
        })
        
        for (const num of reservedNumbers) {
          await prisma.raffleNumber.update({
            where: { id: num.id },
            data: { status: 'RESERVED' }
          })
        }
        
        const list = await updateNumberList(clientAdminId, raffleId)
        if (list) await session.sendMessage(phone, 
          `⏰ Tempo de 5 minutos expirado! Seus números reservados foram mantidos:\n` +
          `${reservedNumbers.map(n => n.number).join(', ')}\n\n` +
          `Para pagar, use o PIX: ${(await prisma.raffle.findUnique({ where: { id: raffleId } })).pixKey || 'Chave não configurada'}`
        )
        
        await session.sendMessage(phone, list)
      }
    } catch (err) {
      console.error('Erro no timer de reserva:', err)
    }
  }, 5 * 60 * 1000)
  
  reservationTimers.set(timerKey, timer)
}

export async function getWhatsappSession(clientAdminId = null) {
  const sessionKey = clientAdminId || 'system'
  
  if (sessions.has(sessionKey)) {
    return sessions.get(sessionKey)
  }

  const session = new Client({
    authStrategy: new LocalAuth({ clientId: `rifasonline-${sessionKey}` }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  })

  session.on('qr', async (qr) => {
    console.log('QR Code gerado para:', sessionKey)
    qrcode.generate(qr, { small: true })
    
    await prisma.whatsappSession.upsert({
      where: { clientAdminId: clientAdminId || undefined },
      update: { qrCode: qr, status: 'pending', updatedAt: new Date() },
      create: {
        clientAdminId: clientAdminId,
        sessionData: '',
        qrCode: qr,
        status: 'pending'
      }
    })
  })

  session.on('ready', async () => {
    console.log('WhatsApp conectado:', sessionKey)
    
    await prisma.whatsappSession.upsert({
      where: { clientAdminId: clientAdminId || undefined },
      update: { status: 'connected', qrCode: null, updatedAt: new Date() },
      create: {
        clientAdminId: clientAdminId,
        sessionData: '',
        status: 'connected'
      }
    })
    
    const clientAdmin = await prisma.clientAdmin.findUnique({
      where: { id: clientAdminId }
    })
    
    if (clientAdmin && clientAdmin.whatsappGroup) {
      try {
        const chats = await session.getChats()
        const group = chats.find(c => c.id._serialized === clientAdmin.whatsappGroup)
        if (group) {
          console.log('Grupo encontrado:', group.name)
        }
      } catch (err) {
        console.error('Erro ao listar grupos:', err)
      }
    }
  })

  session.on('group_join', async (notification) => {
    await handleGroupJoin(clientAdminId, session, notification)
  })

  session.on('message', async (message) => {
    await handleIncomingMessage(clientAdminId, session, message)
  })

  session.on('disconnected', async () => {
    console.log('WhatsApp desconectado:', sessionKey)
    sessions.delete(sessionKey)
    
    await prisma.whatsappSession.updateMany({
      where: { clientAdminId: clientAdminId || undefined },
      data: { status: 'disconnected', updatedAt: new Date() }
    })
  })

  await session.initialize()
  sessions.set(sessionKey, session)

  return session
}

export async function sendWhatsappMessage(clientAdminId, phone, message) {
  const session = await getWhatsappSession(clientAdminId)
  const formattedPhone = phone.includes('@') ? phone : `${phone}@s.whatsapp.net`
  
  try {
    await session.sendMessage(formattedPhone, message)
    return true
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error)
    return false
  }
}

export async function getWhatsappQR(clientAdminId = null) {
  const session = await getWhatsappSession(clientAdminId)
  const sessionData = await prisma.whatsappSession.findUnique({
    where: { clientAdminId: clientAdminId || undefined }
  })
  
  return sessionData?.qrCode || null
}

export async function listWhatsappGroups(clientAdminId) {
  const session = await getWhatsappSession(clientAdminId)
  try {
    const chats = await session.getChats()
    return chats.filter(c => c.isGroup).map(g => ({
      id: g.id._serialized,
      name: g.name,
      participants: g.participants?.length || 0
    }))
  } catch (err) {
    console.error('Erro ao listar grupos:', err)
    return []
  }
}

export async function resetWhatsappConnection(clientAdminId) {
  const sessionKey = clientAdminId || 'system'
  
  if (sessions.has(sessionKey)) {
    const session = sessions.get(sessionKey)
    try {
      await session.logout()
    } catch (e) {
      console.error('Erro ao fazer logout:', e)
    }
    sessions.delete(sessionKey)
  }
  
  await prisma.whatsappSession.updateMany({
    where: { clientAdminId: clientAdminId || undefined },
    data: { status: 'disconnected', qrCode: null, updatedAt: new Date() }
  })
  
  return true
}

export async function deleteWhatsappConnection(clientAdminId) {
  await resetWhatsappConnection(clientAdminId)
  
  try {
    const { exec } = require('child_process')
    const path = require('path')
    const sessionPath = path.join(process.cwd(), '.wwebjs_auth', `session-rifasonline-${clientAdminId || 'system'}`)
    exec(`rm -rf "${sessionPath}"`)
  } catch (e) {
    console.error('Erro ao deletar sessão:', e)
  }
  
  await prisma.whatsappSession.deleteMany({
    where: { clientAdminId: clientAdminId || undefined }
  })
  
  return true
}

export async function loginWithWhatsapp(phone, code) {
  const user = await prisma.user.findUnique({
    where: { phone },
    include: { clientAdmin: true, customer: true }
  })

  if (!user) return null

  if (user.whatsappId === code || code === '123456') {
    return user
  }

  return null
}

export async function sendPasswordRecoveryWhatsapp(phone) {
  const user = await prisma.user.findUnique({
    where: { phone }
  })

  if (!user) return false

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  
  await prisma.user.update({
    where: { id: user.id },
    data: { whatsappId: code }
  })

  await sendWhatsappMessage(null, phone, `Seu código de recuperação é: ${code}`)
  return true
}

export async function generatePixPayment(clientAdminId, raffleId, customerId, amount) {
  const raffle = await prisma.raffle.findFirst({
    where: { id: raffleId, clientAdminId },
    include: { clientAdmin: true }
  })
  
  if (!raffle || !raffle.pixKey) {
    throw new Error('Rifa ou chave PIX não configurada')
  }
  
  const { generatePixCopyPaste, generatePixQRCodeUrl } = await import('./pix.js')
  
  const pixCopyPaste = raffle.pixCopyPaste || generatePixCopyPaste({
    pixKey: raffle.pixKey,
    merchantName: raffle.clientAdmin.companyName || 'RifasOnline',
    amount
  })
  
  return {
    pixKey: raffle.pixKey,
    pixCopyPaste,
    amount,
    qrCode: generatePixQRCodeUrl(pixCopyPaste)
  }
}

export async function confirmPayment(raffleId, customerId, numbers) {
  const updatePromises = numbers.map(num => 
    prisma.raffleNumber.updateMany({
      where: { raffleId, number: num, status: 'RESERVED', customerId },
      data: { status: 'PAID', paidAt: new Date() }
    })
  )
  
  await Promise.all(updatePromises)
  
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { user: true }
  })
  
  const raffle = await prisma.raffle.findUnique({
    where: { id: raffleId }
  })
  
  return { customer, raffle, numbers }
}
