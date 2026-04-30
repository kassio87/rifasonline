import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import styles from '../styles/Login.module.css'

export default function RecoverPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email && !phone) {
      setError('Informe e-mail ou telefone')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Erro ao processar solicitação')
      }
    } catch (err) {
      setError('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Recuperar Senha - RifasOnline</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>🔒 Recuperar Senha</h1>
            <p className={styles.subtitle}>
              Informe seu e-mail ou WhatsApp para recuperar o acesso
            </p>
          </div>

          {success ? (
            <div className={styles.success}>
              <p>Instruções enviadas! Verifique seu e-mail ou WhatsApp.</p>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => router.push('/login')}
              >
                Voltar ao Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="E-mail"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className={styles.divider}>
                <span>ou</span>
              </div>

              <Input
                label="WhatsApp"
                name="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {error && <div className={styles.error}>{error}</div>}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Recuperar Senha'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => router.push('/login')}
              >
                Voltar ao Login
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
