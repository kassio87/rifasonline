import { useState, useEffect } from 'react'
import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { getRaffles } from '../../lib/api'
import styles from '../../styles/Layout.module.css'

export default function SorteioPage() {
  const [rifas, setRifas] = useState([])
  const [selectedRifa, setSelectedRifa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drawing, setDrawing] = useState(false)
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    loadRaffles()
  }, [])

  async function loadRaffles() {
    try {
      setLoading(true)
      const data = await getRaffles()
      setRifas(data.filter(r => r.status === 'FINISHED' || r.status === 'ACTIVE'))
      if (data.length > 0) {
        setSelectedRifa(data[0])
      }
    } catch (err) {
      setError('Erro ao carregar rifas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDraw() {
    if (!selectedRifa) return
    if (!confirm('Tem certeza que deseja realizar o sorteio? Esta ação não pode ser desfeita.')) return
    
    try {
      setDrawing(true)
      setWinner(null)
      
      // Simular sorteio (na implementação real, seria uma chamada à API)
      const paidNumbers = selectedRifa.numbers?.filter(n => n.status === 'PAID') || []
      
      if (paidNumbers.length === 0) {
        setError('Nenhum número vendido para esta rifa')
        setDrawing(false)
        return
      }
      
      // Simular um delay para o sorteio
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const randomWinner = paidNumbers[Math.floor(Math.random() * paidNumbers.length)]
      setWinner({
        number: randomWinner.number,
        customer: randomWinner.customer?.user?.name || 'Cliente',
        phone: randomWinner.customer?.user?.phone || '-'
      })
    } catch (err) {
      setError('Erro ao realizar sorteio')
    } finally {
      setDrawing(false)
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

  const soldNumbers = selectedRifa?.numbers?.filter(n => n.status === 'PAID').length || 0

  return (
    <AdminClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Sorteio</h1>
          <p className={styles.pageSubtitle}>Realize o sorteio das suas rifas</p>
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
          <Card title="Selecionar Rifa">
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Escolha a Rifa
              </label>
              <select 
                value={selectedRifa?.id || ''}
                onChange={(e) => {
                  const rifa = rifas.find(r => r.id === parseInt(e.target.value))
                  setSelectedRifa(rifa)
                  setWinner(null)
                }}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--color-gray-300)',
                  fontFamily: 'var(--font-family)'
                }}
              >
                <option value="">Selecione uma rifa...</option>
                {rifas.map(rifa => (
                  <option key={rifa.id} value={rifa.id}>
                    {rifa.title} ({rifa.numbers?.filter(n => n.status === 'PAID').length || 0} vendidos)
                  </option>
                ))}
              </select>
            </div>

            {selectedRifa && (
              <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Prêmio:</strong> {selectedRifa.title}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Descrição:</strong> {selectedRifa.description || '-'}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Números Vendidos:</strong> {soldNumbers}/{selectedRifa.totalNumbers}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Data do Sorteio:</strong> {selectedRifa.drawDate ? new Date(selectedRifa.drawDate).toLocaleDateString('pt-BR') : 'Não definida'}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: selectedRifa.status === 'FINISHED' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                    color: selectedRifa.status === 'FINISHED' ? 'var(--color-success)' : 'var(--color-warning)'
                  }}>
                    {selectedRifa.status === 'FINISHED' ? 'Finalizada' : 'Ativa'}
                  </span>
                </div>
              </div>
            )}
          </Card>

          <Card title="Realizar Sorteio">
            {drawing ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎲</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Sorteando...
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>
                  Por favor, aguarde...
                </div>
              </div>
            ) : winner ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-success)', marginBottom: '8px' }}>
                  Parabéns!
                </div>
                <div style={{ fontSize: '18px', marginBottom: '16px' }}>
                  Número Sorteado: <strong style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{winner.number}</strong>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: '4px' }}>
                  <strong>Ganhador:</strong> {winner.customer}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: '24px' }}>
                  <strong>WhatsApp:</strong> {winner.phone}
                </div>
                <Button variant="primary" onClick={() => setWinner(null)}>
                  Novo Sorteio
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎰</div>
                <div style={{ fontSize: '16px', color: 'var(--color-gray-600)', marginBottom: '24px' }}>
                  Clique no botão abaixo para realizar o sorteio
                </div>
                <Button 
                  variant="primary" 
                  size="large"
                  disabled={!selectedRifa || soldNumbers === 0}
                  onClick={handleDraw}
                >
                  🎲 Realizar Sorteio
                </Button>
                {(!selectedRifa || soldNumbers === 0) && (
                  <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', marginTop: '8px' }}>
                    {!selectedRifa ? 'Selecione uma rifa primeiro' : 'Esta rifa não possui números vendidos'}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <Card title="Instruções do Sorteio" style={{ marginTop: '32px' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: '1.6' }}>
            <h3 style={{ color: 'var(--color-gray-800)', marginBottom: '8px' }}>Como funciona:</h3>
            <ol style={{ paddingLeft: '20px' }}>
              <li>Selecione a rifa que deseja realizar o sorteio</li>
              <li>Certifique-se de que a rifa possui números vendidos</li>
              <li>Clique em "Realizar Sorteio"</li>
              <li>O sistema sorteará um número aleatório entre os números pagos</li>
              <li>O ganhador será exibido na tela</li>
            </ol>
            
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: 'var(--color-warning-light)', 
              borderRadius: '8px',
              color: 'var(--color-warning)'
            }}>
              <strong>⚠️ Atenção:</strong> O sorteio deve ser realizado apenas após a data estipulada e com todos os números vendidos ou prazo encerrado.
            </div>
          </div>
        </Card>
      </div>
    </AdminClientLayout>
  )
}
