import AdminSystemLayout from '../../components/layout/AdminSystemLayout'
import Card from '../../components/ui/Card'
import styles from '../../styles/Layout.module.css'

export default function AdminSistemaDashboard() {
  const stats = [
    { title: 'Total Clientes', value: '128', change: '+12%', icon: '👥' },
    { title: 'Receita Mensal', value: 'R$ 45.200', change: '+8%', icon: '💰' },
    { title: 'Rifas Ativas', value: '342', change: '+23%', icon: '🎟️' },
    { title: 'Tickets Abertos', value: '5', change: '-2', icon: '🎫' },
  ]

  return (
    <AdminSystemLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard do Sistema</h1>
          <p className={styles.pageSubtitle}>Visão geral de todos os clientes RifasOnline</p>
        </div>

        <div className={styles.gridTwo}>
          {stats.map((stat, index) => (
            <Card key={index} title={stat.title}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: stat.change.startsWith('+') ? 'var(--color-success)' : 'var(--color-danger)',
                    marginTop: '4px'
                  }}>
                    {stat.change} vs mês anterior
                  </div>
                </div>
                <div style={{ fontSize: '48px' }}>{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: '32px' }} className={styles.gridTwo}>
          <Card title="Clientes Recentes" subtitle="Últimos 5 clientes cadastrados">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['Rifa Top SP', 'Sorteios RJ', 'Lucky Draw BH', 'Mega Rifas DF', 'Sorteio Legal RS'].map((cliente, i) => (
                <li key={i} style={{ 
                  padding: '12px 0', 
                  borderBottom: '1px solid var(--color-gray-200)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{cliente}</span>
                  <span style={{ color: 'var(--color-gray-500)', fontSize: '14px' }}>
                    {new Date(Date.now() - i * 86400000).toLocaleDateString('pt-BR')}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Planos Mais Populares" subtitle="Distribuição de assinaturas">
            {[
              { nome: 'Básico', quantidade: 45, percent: 35 },
              { nome: 'Pro', quantidade: 68, percent: 53 },
              { nome: 'Enterprise', quantidade: 15, percent: 12 },
            ].map((plano, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>{plano.nome}</span>
                  <span>{plano.quantidade} clientes</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: 'var(--color-gray-200)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${plano.percent}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--color-primary)' 
                  }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AdminSystemLayout>
  )
}
