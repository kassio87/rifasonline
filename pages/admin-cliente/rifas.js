import { useState, useEffect } from 'react'
import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getRaffles, createRaffle, updateRaffle, deleteRaffle } from '../../lib/api'
import styles from '../../styles/Layout.module.css'

export default function RifasPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingRifa, setEditingRifa] = useState(null)
  const [rifas, setRifas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalNumbers: '',
    pricePerNumber: '',
    drawDate: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    loadRaffles()
  }, [])

  async function loadRaffles() {
    try {
      setLoading(true)
      const data = await getRaffles()
      setRifas(data)
    } catch (err) {
      setError('Erro ao carregar rifas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir esta rifa?')) return
    try {
      await deleteRaffle(id)
      loadRaffles()
    } catch (err) {
      setError('Erro ao excluir rifa')
    }
  }

  function handleEdit(rifa) {
    setEditingRifa(rifa)
    setFormData({
      title: rifa.title || '',
      description: rifa.description || '',
      totalNumbers: rifa.totalNumbers?.toString() || '',
      pricePerNumber: rifa.pricePerNumber?.toString() || '',
      drawDate: rifa.drawDate ? new Date(rifa.drawDate).toISOString().split('T')[0] : '',
      status: rifa.status || 'ACTIVE'
    })
    setShowModal(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        totalNumbers: parseInt(formData.totalNumbers),
        pricePerNumber: parseFloat(formData.pricePerNumber)
      }

      if (editingRifa) {
        await updateRaffle(editingRifa.id, data)
      } else {
        await createRaffle(data)
      }
      setShowModal(false)
      setEditingRifa(null)
      setFormData({
        title: '',
        description: '',
        totalNumbers: '',
        pricePerNumber: '',
        drawDate: '',
        status: 'ACTIVE'
      })
      loadRaffles()
    } catch (err) {
      setError(`Erro ao ${editingRifa ? 'salvar' : 'criar'} rifa`)
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
        <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className={styles.pageTitle}>Rifas</h1>
            <p className={styles.pageSubtitle}>Gerenciar rifas do seu cliente</p>
          </div>
          <Button variant="primary" onClick={() => { setEditingRifa(null); setFormData({
            title: '',
            description: '',
            totalNumbers: '',
            pricePerNumber: '',
            drawDate: '',
            status: 'ACTIVE'
          }); setShowModal(true); }}>
            + Nova Rifa
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
          {rifas.map((rifa) => {
            const soldNumbers = rifa.numbers?.filter(n => n.status === 'PAID').length || 0
            const progress = rifa.totalNumbers > 0 ? (soldNumbers / rifa.totalNumbers) * 100 : 0
            
            return (
              <Card key={rifa.id} title={rifa.title}>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '16px', fontSize: '14px' }}>
                  {rifa.description || 'Sem descrição'}
                </p>
                
                <div style={{ 
                  height: '8px', 
                  backgroundColor: 'var(--color-gray-200)', 
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--color-primary)' 
                  }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: 'var(--color-gray-600)' }}>Preço:</span>
                    <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>R$ {rifa.pricePerNumber?.toFixed(2)}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-gray-600)' }}>Vendidos:</span>
                    <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>{soldNumbers}/{rifa.totalNumbers}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-gray-600)' }}>Sorteio:</span>
                    <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>
                      {rifa.drawDate ? new Date(rifa.drawDate).toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </div>
                  <div>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      backgroundColor: rifa.status === 'ACTIVE' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                      color: rifa.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-warning)'
                    }}>
                      {rifa.status === 'ACTIVE' ? 'Ativa' : rifa.status}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="small" onClick={() => handleEdit(rifa)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="small" onClick={() => handleDelete(rifa.id)}>
                    Excluir
                  </Button>
                </div>
              </Card>
            )
          })}
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
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginBottom: '16px' }}>
                {editingRifa ? 'Editar Rifa' : 'Nova Rifa'}
              </h2>
               
              <form onSubmit={handleSave}>
                <Input 
                  label="Nome da Rifa" 
                  placeholder="Ex: Rifa iPhone 15"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <Input 
                  label="Descrição" 
                  placeholder="Descreva o prêmio"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input 
                    label="Total de Números" 
                    type="number" 
                    placeholder="500"
                    value={formData.totalNumbers}
                    onChange={(e) => setFormData({...formData, totalNumbers: e.target.value})}
                    required
                  />
                  <Input 
                    label="Preço por Número (R$)" 
                    type="number" 
                    placeholder="25.00"
                    value={formData.pricePerNumber}
                    onChange={(e) => setFormData({...formData, pricePerNumber: e.target.value})}
                    required
                  />
                </div>

                <Input 
                  label="Data do Sorteio" 
                  type="date"
                  value={formData.drawDate}
                  onChange={(e) => setFormData({...formData, drawDate: e.target.value})}
                />

                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    Status
                  </label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--color-gray-300)',
                      fontFamily: 'var(--font-family)'
                    }}>
                    <option value="ACTIVE">Ativa</option>
                    <option value="PAUSED">Pausada</option>
                    <option value="FINISHED">Finalizada</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                  <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" fullWidth type="submit">
                    {editingRifa ? 'Salvar Alterações' : 'Criar Rifa'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminClientLayout>
  )
}
