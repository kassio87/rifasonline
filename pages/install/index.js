import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Install.module.css'

export default function InstallWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [installed, setInstalled] = useState(false)

  // Dados do formulário
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'rifasonline'
  })

  const [adminConfig, setAdminConfig] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [systemConfig, setSystemConfig] = useState({
    systemName: 'RifasOnline',
    primaryColor: '#000000',
    secondaryColor: '#ffffff'
  })

  useEffect(() => {
    checkInstallation()
  }, [])

  async function checkInstallation() {
    try {
      const res = await fetch('/api/install/check')
      const data = await res.json()
      if (data.installed) {
        setInstalled(true)
        router.push('/')
      }
    } catch (err) {
      console.error('Erro ao verificar instalação:', err)
    }
  }

  async function testDatabase() {
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/install/setup-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbConfig)
      })
      const data = await res.json()
      
      if (data.success) {
        setStep(2)
      } else {
        setError(data.error || 'Falha na conexão')
      }
    } catch (err) {
      setError('Erro ao testar conexão: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createAdmin() {
    if (adminConfig.password !== adminConfig.confirmPassword) {
      setError('Senhas não conferem')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/install/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...adminConfig,
          ...systemConfig
        })
      })
      const data = await res.json()

      if (data.success) {
        setStep(3)
      } else {
        setError(data.error || 'Erro ao criar admin')
      }
    } catch (err) {
      setError('Erro ao criar administrador: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (installed) {
    return null
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Install Wizard - RifasOnline</title>
      </Head>

      <div className={styles.wizard}>
        <h1>RifasOnline - Assistente de Instalação</h1>
        
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1. Banco de Dados</div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2. Administrador</div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>3. Concluído</div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {step === 1 && (
          <div className={styles.form}>
            <h2>Configuração do MySQL</h2>
            <input type="text" placeholder="Host" value={dbConfig.host} onChange={e => setDbConfig({...dbConfig, host: e.target.value})} />
            <input type="text" placeholder="Porta" value={dbConfig.port} onChange={e => setDbConfig({...dbConfig, port: e.target.value})} />
            <input type="text" placeholder="Usuário" value={dbConfig.user} onChange={e => setDbConfig({...dbConfig, user: e.target.value})} />
            <input type="password" placeholder="Senha" value={dbConfig.password} onChange={e => setDbConfig({...dbConfig, password: e.target.value})} />
            <input type="text" placeholder="Nome do Banco" value={dbConfig.database} onChange={e => setDbConfig({...dbConfig, database: e.target.value})} />
            <button onClick={testDatabase} disabled={loading}>
              {loading ? 'Testando...' : 'Testar Conexão'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.form}>
            <h2>Criar Administrador do Sistema</h2>
            <input type="text" placeholder="Nome" value={adminConfig.name} onChange={e => setAdminConfig({...adminConfig, name: e.target.value})} />
            <input type="email" placeholder="E-mail" value={adminConfig.email} onChange={e => setAdminConfig({...adminConfig, email: e.target.value})} />
            <input type="password" placeholder="Senha" value={adminConfig.password} onChange={e => setAdminConfig({...adminConfig, password: e.target.value})} />
            <input type="password" placeholder="Confirmar Senha" value={adminConfig.confirmPassword} onChange={e => setAdminConfig({...adminConfig, confirmPassword: e.target.value})} />
            
            <h3>Configurações do Sistema</h3>
            <input type="text" placeholder="Nome do Sistema" value={systemConfig.systemName} onChange={e => setSystemConfig({...systemConfig, systemName: e.target.value})} />
            <input type="color" value={systemConfig.primaryColor} onChange={e => setSystemConfig({...systemConfig, primaryColor: e.target.value})} />
            <input type="color" value={systemConfig.secondaryColor} onChange={e => setSystemConfig({...systemConfig, secondaryColor: e.target.value})} />
            
            <button onClick={createAdmin} disabled={loading}>
              {loading ? 'Criando...' : 'Finalizar Instalação'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className={styles.success}>
            <h2>Instalação Concluída!</h2>
            <p>O sistema foi instalado com sucesso.</p>
            <button onClick={() => router.push('/')}>Ir para o Login</button>
          </div>
        )}
      </div>
    </div>
  )
}
