import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from '../../styles/Layout.module.css'

export default function AdminClienteDashboard() {
  const stats = [
    { title: 'Rifas Ativas', value: '8', icon: '🎟️' },
    { title: 'Vendas Hoje', value: 'R$ 1.250', icon: '💰' },
    { title: 'Tickets Vendidos', value: '342', icon: '🎫' },
    { title: 'Status Assinatura', value: 'Ativa', icon: '✅' },
  ]

  const rifasRecentes = [
    { id: 1, nome: 'Rifa iPhone 15', vendidos: 145, total: 500, status: 'Ativa' },
    { id: 2, nome: 'Rifa Viagem Cancún', vendidos: 89, total: 200, status: 'Ativa' },
    { id: 3, nome: 'Rifa TV 75"', vendidos: 200, total: 300, status: 'Finalizando' },
  ]

  return (
    <AdminClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard do Cliente</h1>
          <p className={styles.pageSubtitle}>Visão geral das suas rifas e vendas</p>
        </div>

        <div className={styles.gridTwo}>
          {stats.map((stat, index) => (
            <Card key={index} title={stat.title}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '48px' }}>{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: '32px' }}>
          <Card 
            title="Rifas Recentes" 
            headerContent={
              <Button variant="primary" size="small" onClick={() => window.location.href = '/admin-cliente/rifas'}>
                Ver Todas
              </Button>
            }
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-gray-200)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px' }}>Rifa</th>
                    <th style={{ textAlign: 'center', padding: '12px 8px' }}>Progresso</th>
                    <th style={{ textAlign: 'center', padding: '12px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rifasRecentes.map((rifa) => (
                    <tr key={rifa.id} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{rifa.nome}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            flex: 1, 
                            height: '8px', 
                            backgroundColor: 'var(--color-gray-200)', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${(rifa.vendidos / rifa.total) * 100}%`, 
                              height: '100%', 
                              backgroundColor: 'var(--color-primary)' 
                            }} />
                          </div>
                          <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {rifa.vendidos}/{rifa.total}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          backgroundColor: rifa.status === 'Ativa' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                          color: rifa.status === 'Ativa' ? 'var(--color-success)' : 'var(--color-warning)'
                        }}>
                          {rifa.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AdminClientLayout>
  )
}
