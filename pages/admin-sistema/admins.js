import { useState } from 'react'
import AdminSystemLayout from '../../components/layout/AdminSystemLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import styles from '../../styles/Layout.module.css'

export default function AdminsCliente() {
  const [showModal, setShowModal] = useState(false)
  const [admins] = useState([
    { id: 1, nome: 'João Silva', email: 'joao@rifatop.com', whatsapp: '(11) 99999-1111', cliente: 'Rifa Top SP', dataCriacao: '2026-01-15' },
    { id: 2, nome: 'Maria Santos', email: 'maria@sorteiosrj.com', whatsapp: '(21) 98888-2222', cliente: 'Sorteios RJ', dataCriacao: '2026-02-20' },
    { id: 3, nome: 'Pedro Costa', email: 'pedro@luckydraw.com', whatsapp: '(31) 97777-3333', cliente: 'Lucky Draw BH', dataCriacao: '2026-03-10' },
  ])

  const clientes = ['Rifa Top SP', 'Sorteios RJ', 'Lucky Draw BH', 'Mega Rifas DF', 'Sorteio Legal RS']

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
                      <div style={{ fontWeight: 'bold' }}>{admin.nome}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-gray-600)' }}>{admin.email}</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>{admin.whatsapp}</td>
                    <td style={{ padding: '12px 8px' }}>{admin.cliente}</td>
                    <td style={{ padding: '12px 8px' }}>
                      {new Date(admin.dataCriacao).toLocaleDateString('pt-BR')}
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
              
              <Input label="Nome Completo" placeholder="Nome do administrador" />
              <Input label="E-mail" type="email" placeholder="admin@exemplo.com" />
              <Input label="WhatsApp" type="tel" placeholder="(11) 99999-9999" />
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Cliente
                </label>
                <select style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--color-gray-300)',
                  fontFamily: 'var(--font-family)'
                }}>
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente, i) => (
                    <option key={i} value={cliente}>{cliente}</option>
                  ))}
                </select>
              </div>

              <Input label="Senha Temporária" type="password" placeholder="Mínimo 6 caracteres" />
              <Input label="Confirmar Senha" type="password" placeholder="Digite novamente" />

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" fullWidth>
                  Criar Admin
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSystemLayout>
  )
}
