import { useState, useEffect } from 'react'
import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { getDashboardStats, getRaffles } from '../../lib/api'
import styles from '../../styles/Layout.module.css'

export default function AdminClienteDashboard() {
  const [stats, setStats] = useState(null)
  const [rifas, setRifas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [statsData, rifasData] = await Promise.all([
        getDashboardStats(),
        getRaffles()
      ])
      setStats(statsData.overview)
      setRifas(rifasData.slice(0, 3)) // Pegar apenas as 3 mais recentes
    } catch (err) {
      setError('Erro ao carregar dados')
      console.error(err)
    } finally {
      setLoading(false)
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

  const statCards = [
    { title: 'Total Rifas', value: rifas.length.toString(), icon: '🎟️' },
    { title: 'Vendas Totais', value: stats?.totalSales?.toString() || '0', icon: '💰' },
    { title: 'Números Vendidos', value: stats?.totalNumbersSold?.toString() || '0', icon: '🎫' },
    { title: 'Receita Total', value: `R$ ${stats?.totalSalesAmount?.toFixed(2) || '0.00'}`, icon: '💳' },
  ]

  return (
    <AdminClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard do Cliente</h1>
          <p className={styles.pageSubtitle}>Visão geral das suas rifas e vendas</p>
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
          {statCards.map((stat, index) => (
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
                  {rifas.map((rifa) => {
                    const soldNumbers = rifa.numbers?.filter(n => n.status === 'PAID').length || 0
                    const progress = rifa.totalNumbers > 0 ? (soldNumbers / rifa.totalNumbers) * 100 : 0
                    
                    return (
                      <tr key={rifa.id} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{rifa.title}</td>
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
                                width: `${progress}%`, 
                                height: '100%', 
                                backgroundColor: 'var(--color-primary)' 
                              }} />
                            </div>
                            <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                              {soldNumbers}/{rifa.totalNumbers}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '12px',
                            backgroundColor: rifa.status === 'ACTIVE' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                            color: rifa.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-warning)'
                          }}>
                            {rifa.status === 'ACTIVE' ? 'Ativa' : rifa.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AdminClientLayout>
  )
}
