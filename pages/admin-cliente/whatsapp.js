import { useState, useEffect } from 'react'
import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from '../../styles/Layout.module.css'

export default function WhatsAppPage() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qrCode, setQrCode] = useState(null)
  const [groups, setGroups] = useState([])
  const [showGroups, setShowGroups] = useState(false)

  useEffect(() => {
    loadSession()
  }, [])

  async function loadSession() {
    try {
      setLoading(true)
      const data = await fetch('/api/whatsapp', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(res => res.json())
      
      setSession(data)
      setQrCode(data.qrCode)
    } catch (err) {
      setError('Erro ao carregar sessão WhatsApp')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleConnect() {
    try {
      setError('')
      const data = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action: 'connect' })
      }).then(res => res.json())
      
      setQrCode(data.qrCode)
      setSession({ ...session, status: 'connecting' })
      
      // Polling para verificar se conectou
      const interval = setInterval(async () => {
        const status = await fetch('/api/whatsapp', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json())
        
        if (status.status === 'connected') {
          clearInterval(interval)
          setSession(status)
          setQrCode(null)
          loadSession()
        }
      }, 3000)
    } catch (err) {
      setError('Erro ao conectar WhatsApp')
    }
  }

  async function handleDisconnect() {
    if (!confirm('Tem certeza que deseja desconectar?')) return
    
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action: 'disconnect' })
      }).then(res => res.json())
      
      setSession({ status: 'disconnected' })
      setQrCode(null)
    } catch (err) {
      setError('Erro ao desconectar')
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir a conexão? Esta ação não pode ser desfeita.')) return
    
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action: 'delete' })
      }).then(res => res.json())
      
      setSession(null)
      setQrCode(null)
    } catch (err) {
      setError('Erro ao excluir conexão')
    }
  }

  async function loadGroups() {
    try {
      const data = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action: 'groups' })
      }).then(res => res.json())
      
      setGroups(data.groups || [])
      setShowGroups(true)
    } catch (err) {
      setError('Erro ao carregar grupos')
    }
  }

  if (loading) {
    return (
      <AdminClientLayout>
        <div className={styles.container}>
          <p>Carregando...</p>
        </div>
      </AdminClientLayout>
    )
  }

  return (
    <AdminClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>WhatsApp</h1>
          <p className={styles.pageSubtitle}>Gerencie a conexão do WhatsApp para vendas automáticas</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <div className={styles.gridTwo}>
          <Card title="Status da Conexão">
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '16px',
                color: session?.status === 'connected' ? 'var(--color-success)' : 'var(--color-gray-400)'
              }}>
                {session?.status === 'connected' ? '✅' : session?.status === 'connecting' ? '⏳' : '❌'}
              </div>
              
              <div style={{ 
                padding: '8px 16px',
                backgroundColor: session?.status === 'connected' ? 'var(--color-success-light)' : 
                            session?.status === 'connecting' ? 'var(--color-warning-light)' : 
                            'var(--color-danger-light)',
                color: session?.status === 'connected' ? 'var(--color-success)' : 
                       session?.status === 'connecting' ? 'var(--color-warning)' : 
                       'var(--color-danger)',
                borderRadius: '4px',
                display: 'inline-block',
                fontWeight: 'bold',
                marginBottom: '16px'
              }}>
                {session?.status === 'connected' ? 'Conectado' : 
                 session?.status === 'connecting' ? 'Conectando...' : 
                 'Desconectado'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                {session?.status !== 'connected' ? (
                  <Button variant="primary" fullWidth onClick={handleConnect}>
                    {session?.status === 'connecting' ? 'Aguardando QR Code...' : 'Conectar WhatsApp'}
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" fullWidth onClick={loadGroups}>
                      Ver Grupos
                    </Button>
                    <Button variant="danger" fullWidth onClick={handleDisconnect}>
                      Desconectar
                    </Button>
                  </>
                )}
                
                {session && (
                  <Button variant="danger" size="small" onClick={handleDelete}>
                    Excluir Conexão
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card title="QR Code">
            {qrCode ? (
              <div style={{ textAlign: 'center' }}>
                <img src={qrCode} alt="QR Code WhatsApp" style={{ maxWidth: '100%' }} />
                <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginTop: '12px' }}>
                  Escaneie o código com o WhatsApp no seu celular
                </p>
              </div>
            ) : session?.status === 'connected' ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
                <p style={{ color: 'var(--color-gray-600)' }}>
                  WhatsApp conectado com sucesso!
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                <p style={{ color: 'var(--color-gray-600)' }}>
                  Clique em "Conectar WhatsApp" para gerar o QR Code
                </p>
              </div>
            )}
          </Card>
        </div>

        {showGroups && (
          <Card title="Grupos do WhatsApp" style={{ marginTop: '32px' }}>
            {groups.length > 0 ? (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {groups.map((group, i) => (
                  <div key={i} style={{ 
                    padding: '12px', 
                    borderBottom: i < groups.length - 1 ? '1px solid var(--color-gray-200)' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{group.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-gray-600)' }}>
                        {group.participants || 0} participantes
                      </div>
                    </div>
                    <Button variant="outline" size="small">
                      Configurar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-gray-600)', textAlign: 'center', padding: '20px' }}>
                Nenhum grupo encontrado
              </p>
            )}
          </Card>
        )}

        <Card title="Instruções" style={{ marginTop: '32px' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: '1.6' }}>
            <h3 style={{ color: 'var(--color-gray-800)', marginBottom: '8px' }}>Como funciona:</h3>
            <ol style={{ paddingLeft: '20px' }}>
              <li>Clique em "Conectar WhatsApp" para gerar o QR Code</li>
              <li>Abra o WhatsApp no seu celular</li>
              <li>Vá em Menu → WhatsApp Web → Escanear QR Code</li>
              <li>Aponte a câmera para o código exibido aqui</li>
              <li>Pronto! O chatbot estará ativo para vendas automáticas</li>
            </ol>
            
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: 'var(--color-info-light)', 
              borderRadius: '8px',
              color: 'var(--color-info)'
            }}>
              <strong>💡 Dica:</strong> Mantenha o celular conectado à internet para que o chatbot funcione 24/7
            </div>
          </div>
        </Card>
      </div>
    </AdminClientLayout>
  )
}
