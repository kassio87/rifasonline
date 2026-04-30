import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import styles from '../styles/Login.module.css'

export default function Login() {
  const router = useRouter()
  const [step, setStep] = useState('whatsapp') // 'whatsapp' | 'password'
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault()
    if (!whatsapp || whatsapp.length < 10) {
      setError('Digite um número de WhatsApp válido')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/check-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp }),
      })
      
      const data = await response.json()
      
      if (data.exists) {
        if (data.hasPassword) {
          setStep('password')
        } else {
          setStep('password')
        }
      } else {
        setStep('password')
      }
    } catch (err) {
      setError('Erro ao verificar número. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: whatsapp, password }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('token', data.token)
        router.push('/dashboard')
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login - RifasOnline</title>
      </Head>
      
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>🎉 RifasOnline</h1>
            <p className={styles.subtitle}>
              {step === 'whatsapp' 
                ? 'Digite seu WhatsApp para entrar ou criar sua conta'
                : 'Crie uma senha para sua conta'
              }
            </p>
          </div>
          
          {step === 'whatsapp' ? (
            <form onSubmit={handleWhatsAppSubmit} className={styles.form}>
              <Input
                label="WhatsApp"
                name="whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                helpText="Digite seu número com DDD"
              />
              
              {error && <div className={styles.error}>{error}</div>}
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Continuar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className={styles.form}>
              <Input
                label="WhatsApp"
                name="whatsapp"
                type="tel"
                value={whatsapp}
                disabled
              />
              
              <Input
                label="Criar Senha"
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
              
              <div className={styles.buttonGroup}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setStep('whatsapp')
                    setError('')
                  }}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
