import { authenticateUser, generateToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { emailOrPhone, password } = req.body

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'E-mail/telefone e senha são obrigatórios' })
    }

    const user = await authenticateUser(emailOrPhone, password)

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = generateToken(user)

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
