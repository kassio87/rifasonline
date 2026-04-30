import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'rifasonline-secret-key-2024'
const JWT_EXPIRES_IN = '7d'

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10)
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function authenticateUser(emailOrPhone, password) {
  const isEmail = emailOrPhone.includes('@')
  
  const user = await prisma.user.findFirst({
    where: isEmail 
      ? { email: emailOrPhone }
      : { phone: emailOrPhone },
    include: {
      clientAdmin: true,
      customer: true
    }
  })

  if (!user) return null

  const isValid = await comparePassword(password, user.password)
  if (!isValid) return null

  return user
}

export async function getUserFromToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  
  if (!decoded) return null

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: {
      clientAdmin: true,
      customer: true
    }
  })

  return user
}

export function requireAuth(roles = []) {
  return async (req, res, next) => {
    const user = await getUserFromToken(req)
    
    if (!user) {
      return res.status(401).json({ error: 'Não autorizado' })
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    req.user = user
    return next()
  }
}
