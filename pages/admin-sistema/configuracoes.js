import { useState } from 'react'
import AdminSystemLayout from '../../components/layout/AdminSystemLayout'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import styles from '../../styles/Layout.module.css'

export default function ConfiguracoesSistema() {
  const [config, setConfig] = useState({
    nomeSistema: 'RifasOnline',
    logo: '',
    favicon: '',
    corPrimaria: '#0070f3',
    corSecundaria: '#6c757d',
    corSucesso: '#28a745',
    corReservado: '#ffc107',
    corPago: '#17a2b8',
  })

  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value })
  }

  const handleSave = () => {
    alert('Configurações salvas com sucesso!')
  }

  return (
    <AdminSystemLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Configurações do Sistema</h1>
          <p className={styles.pageSubtitle}>Personalize a aparência do RifasOnline</p>
        </div>

        <div className={styles.gridTwo}>
          <Card title="Identidade Visual">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input 
                label="Nome do Sistema" 
                value={config.nomeSistema}
                onChange={(e) => handleChange('nomeSistema', e.target.value)}
              />
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Logo (URL da imagem)
                </label>
                <Input 
                  placeholder="https://exemplo.com/logo.png"
                  value={config.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                />
                {config.logo && (
                  <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <img src={config.logo} alt="Preview" style={{ maxHeight: '60px' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Favicon (URL)
                </label>
                <Input 
                  placeholder="https://exemplo.com/favicon.ico"
                  value={config.favicon}
                  onChange={(e) => handleChange('favicon', e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card title="Cores do Sistema">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Cor Primária
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="color" 
                    value={config.corPrimaria}
                    onChange={(e) => handleChange('corPrimaria', e.target.value)}
                    style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <Input 
                    value={config.corPrimaria}
                    onChange={(e) => handleChange('corPrimaria', e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Cor Secundária
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="color" 
                    value={config.corSecundaria}
                    onChange={(e) => handleChange('corSecundaria', e.target.value)}
                    style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <Input 
                    value={config.corSecundaria}
                    onChange={(e) => handleChange('corSecundaria', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>Cores de Status (Rifas)</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>✅</span>
                    <span style={{ flex: 1 }}>Disponível</span>
                    <input 
                      type="color" 
                      value={config.corSucesso}
                      onChange={(e) => handleChange('corSucesso', e.target.value)}
                      style={{ width: '30px', height: '30px', border: 'none', borderRadius: '4px' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🔍</span>
                    <span style={{ flex: 1 }}>Reservado</span>
                    <input 
                      type="color" 
                      value={config.corReservado}
                      onChange={(e) => handleChange('corReservado', e.target.value)}
                      style={{ width: '30px', height: '30px', border: 'none', borderRadius: '4px' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>💰</span>
                    <span style={{ flex: 1 }}>Pago</span>
                    <input 
                      type="color" 
                      value={config.corPago}
                      onChange={(e) => handleChange('corPago', e.target.value)}
                      style={{ width: '30px', height: '30px', border: 'none', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <Button variant="secondary" style={{ marginRight: '8px' }}>
            Restaurar Padrão
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>

        <Card title="Preview" subtitle="Visualização das cores configuradas" style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: config.corPrimaria, 
              color: 'white', 
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
              Primária
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: config.corSecundaria, 
              color: 'white', 
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
              Secundária
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: config.corSucesso, 
              color: 'white', 
              borderRadius: '8px'
            }}>
              ✅ Disponível
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: config.corReservado, 
              color: 'black', 
              borderRadius: '8px'
            }}>
              🔍 Reservado
            </div>
            <div style={{ 
              padding: '16px', 
              backgroundColor: config.corPago, 
              color: 'white', 
              borderRadius: '8px'
            }}>
              💰 Pago
            </div>
          </div>
        </Card>
      </div>
    </AdminSystemLayout>
  )
}
