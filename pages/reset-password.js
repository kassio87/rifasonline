import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import styles from '../styles/Login.module.css'

export default function ResetPassword() {
  const router = useRouter()
  const { token } = router.query
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      setError('Token inválido ou expirado')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Erro ao redefinir senha')
      }
    } catch (err) {
      setError('Erro ao redefinir senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!token && !router.isReady) {
    return <div>Carregando...</div>
  }

  return (
    <>
      <Head>
        <title>Redefinir Senha - RifasOnline</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>🔑 Nova Senha</h1>
            <p className={styles.subtitle}>
              Digite sua nova senha
            </p>
          </div>

          {success ? (
            <div className={styles.success}>
              <p>Senha redefinida com sucesso!</p>
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={() => router.push('/login')}
              >
                Ir para Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Nova Senha"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirmar Senha"
                name="confirmPassword"
                type="password"
                placeholder="Digite novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && <div className={styles.error}>{error}</div>}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
