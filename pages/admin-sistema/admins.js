import { useState, useEffect } from 'react'
import AdminSystemLayout from '../../components/layout/AdminSystemLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getClientAdmins, createClientAdmin } from '../../lib/api'
import styles from '../../styles/Layout.module.css'

export default function AdminsCliente() {
  const [showModal, setShowModal] = useState(false)
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  })

  useEffect(() => {
    loadAdmins()
  }, [])

  async function loadAdmins() {
    try {
      setLoading(true)
      const data = await getClientAdmins()
      setAdmins(data)
    } catch (err) {
      setError('Erro ao carregar admins')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateAdmin(e) {
    e.preventDefault()
    try {
      await createClientAdmin(formData)
      setShowModal(false)
      setFormData({ name: '', email: '', phone: '', companyName: '' })
      loadAdmins()
    } catch (err) {
      setError('Erro ao criar admin')
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
            <h1 className={styles.pageTitle}>Admins Cliente</h1>
            <p className={styles.pageSubtitle}>Gerenciar administradores dos clientes</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Novo Admin
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

        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-gray-200)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px' }}>Nome</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px' }}>WhatsApp</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px' }}>Cliente</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px' }}>Data Criação</th>
                  <th style={{ textAlign: 'center', padding: '12px 8px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 'bold' }}>{admin.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-gray-600)' }}>{admin.email}</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>{admin.phone || '-'}</td>
                    <td style={{ padding: '12px 8px' }}>{admin.clientAdmin?.companyName || '-'}</td>
                    <td style={{ padding: '12px 8px' }}>
                      {new Date(admin.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <Button variant="outline" size="small" style={{ marginRight: '8px' }}>
                        Editar
                      </Button>
                      <Button variant="danger" size="small">
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

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
              <h2 style={{ marginBottom: '16px' }}>Novo Admin Cliente</h2>
               
              <form onSubmit={handleCreateAdmin}>
                <Input 
                  label="Nome Completo" 
                  placeholder="Nome do administrador"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input 
                  label="E-mail" 
                  type="email" 
                  placeholder="admin@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Input 
                  label="WhatsApp" 
                  type="tel" 
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Input 
                  label="Empresa" 
                  placeholder="Nome da empresa"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" fullWidth type="submit">
                    Criar Admin
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
