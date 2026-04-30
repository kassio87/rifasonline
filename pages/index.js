import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkInstallation()
  }, [])

  async function checkInstallation() {
    try {
      const response = await fetch('/api/install/check')
      const data = await response.json()
      
      if (!data.installed) {
        router.push('/install')
        return
      }
      
      const token = localStorage.getItem('token')
      if (token) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Erro ao verificar instalação:', error)
      router.push('/install')
    } finally {
      setChecking(false)
    }
  }

  return (
    <>
      <Head>
        <title>RifasOnline - Sistema de Rifas</title>
        <meta name="description" content="Sistema SaaS para gerenciamento de rifas online" />
      </Head>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>🎉 RifasOnline</h1>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>Verificando sistema...</p>
        </div>
      </div>
    </>
  )
}
