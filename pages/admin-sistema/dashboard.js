import { useState, useEffect } from 'react'
import AdminSystemLayout from '../../components/layout/AdminSystemLayout'
import Card from '../../components/ui/Card'
import { getDashboardStats } from '../../lib/api'
import styles from '../../styles/Layout.module.css'

export default function AdminSistemaDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      setLoading(true)
      const data = await getDashboardStats()
      setStats(data.overview)
    } catch (err) {
      setError('Erro ao carregar estatísticas')
      console.error(err)
    } finally {
      setLoading(false)
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

  const statCards = [
    { title: 'Total Clientes', value: stats?.totalClients || 0, change: '', icon: '👥' },
    { title: 'Assinaturas Ativas', value: stats?.activeSubscriptions || 0, change: '', icon: '📋' },
    { title: 'Total Rifas', value: stats?.totalRaffles || 0, change: '', icon: '🎟️' },
    { title: 'Total Vendas', value: stats?.totalSales || 0, change: '', icon: '💰' },
  ]

  return (
    <AdminSystemLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard do Sistema</h1>
          <p className={styles.pageSubtitle}>Visão geral de todos os clientes RifasOnline</p>
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
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    {stat.value}
                  </div>
                  {stat.change && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: stat.change.startsWith('+') ? 'var(--color-success)' : 'var(--color-danger)',
                      marginTop: '4px'
                    }}>
                      {stat.change} vs mês anterior
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '48px' }}>{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: '32px' }} className={styles.gridTwo}>
          <Card title="Receita Total" subtitle="Valor de vendas pagas">
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--color-success)' }}>
              R$ {stats?.totalSalesAmount?.toFixed(2) || '0.00'}
            </div>
            <p style={{ color: 'var(--color-gray-600)', marginTop: '8px' }}>
              {stats?.totalNumbersSold || 0} números vendidos
            </p>
          </Card>

          <Card title="Ações Rápidas" subtitle="Gerenciar sistema">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="/admin-sistema/planos" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Gerenciar Planos
                </button>
              </a>
              <a href="/admin-sistema/admins" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--color-gray-200)',
                  color: 'var(--color-gray-800)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Gerenciar Admins Cliente
                </button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </AdminSystemLayout>
  )
}
