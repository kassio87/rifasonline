import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@rifasonline.com',
      to,
      subject,
      html
    })
    return true
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return false
  }
}

export async function sendPasswordRecoveryEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) return false

  const crypto = await import('crypto')
  const token = crypto.randomBytes(32).toString('hex')
  
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1)

  await prisma.user.update({
    where: { id: user.id },
    data: { 
      whatsappId: token
    }
  })

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  
  await sendEmail(
    email,
    'Recuperação de Senha - RifasOnline',
    `<p>Olá ${user.name},</p>
     <p>Clique no link abaixo para redefinir sua senha:</p>
     <a href="${resetLink}">${resetLink}</a>
     <p>Este link expira em 1 hora.</p>`
  )

  return true
}
