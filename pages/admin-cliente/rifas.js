import { useState } from 'react'
import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import styles from '../../styles/Layout.module.css'

export default function RifasPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingRifa, setEditingRifa] = useState(null)
  const [rifas, setRifas] = useState([
    { 
      id: 1, 
      nome: 'Rifa iPhone 15 Pro', 
      descricao: 'Sorteio do novo iPhone 15 Pro 256GB',
      totalNumeros: 500, 
      precoNumero: 25.00,
      dataSorteio: '2026-05-15',
      status: 'Ativa',
      vendidos: 145
    },
    { 
      id: 2, 
      nome: 'Rifa Viagem Cancún', 
      descricao: 'Passagem + Hotel para 2 pessoas',
      totalNumeros: 200, 
      precoNumero: 100.00,
      dataSorteio: '2026-06-20',
      status: 'Ativa',
      vendidos: 89
    },
    { 
      id: 3, 
      nome: 'Rifa TV 75" 8K', 
      descricao: 'Smart TV 75 polegadas 8K',
      totalNumeros: 300, 
      precoNumero: 50.00,
      dataSorteio: '2026-05-30',
      status: 'Finalizando',
      vendidos: 280
    },
  ])

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta rifa?')) {
      setRifas(rifas.filter(r => r.id !== id))
    }
  }

  const handleEdit = (rifa) => {
    setEditingRifa(rifa)
    setShowModal(true)
  }

  const handleSave = () => {
    setShowModal(false)
    setEditingRifa(null)
    alert('Rifa salva com sucesso!')
  }

  return (
    <AdminClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className={styles.pageTitle}>Rifas</h1>
            <p className={styles.pageSubtitle}>Gerenciar rifas do seu cliente</p>
          </div>
          <Button variant="primary" onClick={() => { setEditingRifa(null); setShowModal(true); }}>
            + Nova Rifa
          </Button>
        </div>

        <div className={styles.gridTwo}>
          {rifas.map((rifa) => (
            <Card key={rifa.id} title={rifa.nome}>
              <p style={{ color: 'var(--color-gray-600)', marginBottom: '16px', fontSize: '14px' }}>
                {rifa.descricao}
              </p>
              
              <div style={{ 
                height: '8px', 
                backgroundColor: 'var(--color-gray-200)', 
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  width: `${(rifa.vendidos / rifa.totalNumeros) * 100}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--color-primary)' 
                }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: 'var(--color-gray-600)' }}>Preço:</span>
                  <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>R$ {rifa.precoNumero.toFixed(2)}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-gray-600)' }}>Vendidos:</span>
                  <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>{rifa.vendidos}/{rifa.totalNumeros}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-gray-600)' }}>Sorteio:</span>
                  <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>
                    {new Date(rifa.dataSorteio).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    backgroundColor: rifa.status === 'Ativa' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                    color: rifa.status === 'Ativa' ? 'var(--color-success)' : 'var(--color-warning)'
                  }}>
                    {rifa.status}
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
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginBottom: '16px' }}>
                {editingRifa ? 'Editar Rifa' : 'Nova Rifa'}
              </h2>
              
              <Input 
                label="Nome da Rifa" 
                placeholder="Ex: Rifa iPhone 15"
                defaultValue={editingRifa?.nome}
              />
              <Input 
                label="Descrição" 
                placeholder="Descreva o prêmio"
                defaultValue={editingRifa?.descricao}
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input 
                  label="Total de Números" 
                  type="number" 
                  placeholder="500"
                  defaultValue={editingRifa?.totalNumeros}
                />
                <Input 
                  label="Preço por Número (R$)" 
                  type="number" 
                  placeholder="25.00"
                  defaultValue={editingRifa?.precoNumero}
                />
              </div>

              <Input 
                label="Data do Sorteio" 
                type="date"
                defaultValue={editingRifa?.dataSorteio}
              />

              <Input 
                label="URL Personalizada" 
                placeholder="minha-rifa-iphone"
                helpText="Será acessada via: rifasonline.com/seu-cliente/minha-rifa-iphone"
              />

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Status
                </label>
                <select style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--color-gray-300)',
                  fontFamily: 'var(--font-family)'
                }}>
                  <option value="Ativa">Ativa</option>
                  <option value="Pausada">Pausada</option>
                  <option value="Finalizada">Finalizada</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" fullWidth onClick={handleSave}>
                  {editingRifa ? 'Salvar Alterações' : 'Criar Rifa'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminClientLayout>
  )
}
