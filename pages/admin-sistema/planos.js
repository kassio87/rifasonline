import { useState, useEffect } from 'react'
import AdminSystemLayout from '../../components/layout/AdminSystemLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getPlans, createPlan, deletePlan } from '../../lib/api'
import styles from '../../styles/Layout.module.css'

export default function GestaoPlanos() {
  const [showModal, setShowModal] = useState(false)
  const [planos, setPlanos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tipoPlano, setTipoPlano] = useState('RECURRENT')
  const [formData, setFormData] = useState({
    name: '',
    type: 'RECURRENT',
    fixedPrice: '',
    description: '',
    limits: []
  })

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    try {
      setLoading(true)
      const data = await getPlans()
      setPlanos(data)
    } catch (err) {
      setError('Erro ao carregar planos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreatePlan(e) {
    e.preventDefault()
    try {
      await createPlan(formData)
      setShowModal(false)
      setFormData({ name: '', type: 'RECURRENT', fixedPrice: '', description: '', limits: [] })
      loadPlans()
    } catch (err) {
      setError('Erro ao criar plano')
    }
  }

  async function handleDeletePlan(id) {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return
    try {
      await deletePlan(id)
      loadPlans()
    } catch (err) {
      setError('Erro ao excluir plano')
    }
  }

  if (loading) {
    return (
      <AdminSystemLayout>
        <div className={styles.container}>
          <p>Carregando...</p>
        </div>
      </AdminSystemLayout>
    )
  }

  return (
    <AdminSystemLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className={styles.pageTitle}>Gestão de Planos</h1>
            <p className={styles.pageSubtitle}>Criar e gerenciar planos recorrentes e fixos</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Novo Plano
          </Button>
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
          {planos.map((plano) => (
            <Card key={plano.id} title={plano.name}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  backgroundColor: plano.type === 'RECURRENT' ? 'var(--color-info-light)' : 'var(--color-warning-light)',
                  color: plano.type === 'RECURRENT' ? 'var(--color-info)' : 'var(--color-warning)'
                }}>
                  {plano.type === 'RECURRENT' ? 'Recorrente' : 'Fixo'}
                </span>
              </div>
               
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '16px' }}>
                {plano.type === 'FIXED' ? 'R$ ' + plano.fixedPrice?.toFixed(2) : 'Recorrente'}
                {plano.type === 'RECURRENT' && <span style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}> (por % de vendas)</span>}
              </div>

              {plano.limits && plano.limits.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: '8px' }}>
                    Faixas de comissão:
                  </div>
                  {plano.limits.map((limit, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span>Até {limit.maxSales} vendas:</span>
                      <span style={{ fontWeight: 'bold' }}>{limit.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <Button variant="outline" size="small">Editar</Button>
                <Button variant="danger" size="small" onClick={() => handleDeletePlan(plano.id)}>Excluir</Button>
              </div>
            </Card>
          ))}
        </div>

        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px'
            }}>
              <h2 style={{ marginBottom: '16px' }}>Novo Plano</h2>
              
              <form onSubmit={handleCreatePlan}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Tipo de Plano</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => {
                      setFormData({...formData, type: e.target.value})
                      setTipoPlano(e.target.value)
                    }}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-gray-300)' }}
                  >
                    <option value="RECURRENT">Recorrente (Por % de vendas)</option>
                    <option value="FIXED">Fixo (Valor único)</option>
                  </select>
                </div>

                <Input 
                  label="Nome do Plano" 
                  placeholder="Ex: Premium" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                
                {formData.type === 'FIXED' && (
                  <Input 
                    label="Preço (R$)" 
                    type="number" 
                    placeholder="99.90"
                    value={formData.fixedPrice}
                    onChange={(e) => setFormData({...formData, fixedPrice: e.target.value})}
                    required
                  />
                )}
                
                <Input 
                  label="Descrição" 
                  placeholder="Descrição do plano"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" fullWidth type="submit">
                    Criar Plano
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminSystemLayout>
  )
}
