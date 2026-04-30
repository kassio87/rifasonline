import { useState, useEffect } from 'react'
import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { getSubscriptions, getPlans } from '../../lib/api'
import styles from '../../styles/Layout.module.css'

export default function AssinaturaPage() {
  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [subscriptionsData, plansData] = await Promise.all([
        getSubscriptions(),
        getPlans()
      ])
      
      if (subscriptionsData && subscriptionsData.length > 0) {
        setSubscription(subscriptionsData[0])
      }
      setPlans(plansData)
    } catch (err) {
      setError('Erro ao carregar assinatura')
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

  const plan = subscription?.plan
  const clientAdmin = subscription?.clientAdmin

  return (
    <AdminClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Minha Assinatura</h1>
          <p className={styles.pageSubtitle}>Gerencie seu plano e pagamentos</p>
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
          <Card title="Detalhes do Plano" subtitle={plan ? `Plano ${plan.name}` : 'Sem plano'}>
            {subscription && (
              <>
                <div style={{ 
                  padding: '8px 16px', 
                  backgroundColor: subscription.status === 'ACTIVE' ? 'var(--color-success-light)' : 'var(--color-warning-light)', 
                  color: subscription.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-warning)',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '16px',
                  fontWeight: 'bold'
                }}>
                  {subscription.status === 'ACTIVE' ? 'Ativa' : subscription.status}
                </div>

                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '16px' }}>
                  {plan?.type === 'FIXED' ? `R$ ${plan.fixedPrice?.toFixed(2)}` : 'Recorrente'}
                  {plan?.type === 'FIXED' && <span style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>/mês</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-600)' }}>Data de Início:</span>
                    <span>{subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString('pt-BR') : '-'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-600)' }}>Última Cobrança:</span>
                    <span>{subscription.lastBilling ? new Date(subscription.lastBilling).toLocaleDateString('pt-BR') : '-'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-600)' }}>Vendas no Período:</span>
                    <span style={{ fontWeight: 'bold' }}>{subscription.salesCount || 0}</span>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="small">Alterar Plano</Button>
                  <Button variant="danger" size="small">Cancelar Assinatura</Button>
                </div>
              </>
            )}
          </Card>

          <Card title="Uso do Plano" subtitle="Limites e utilização atual">
            {plan && plan.limits && plan.limits.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {plan.limits.map((limit, i) => {
                  const currentSales = subscription?.salesCount || 0
                  const progress = limit.maxSales > 0 ? Math.min((currentSales / limit.maxSales) * 100, 100) : 0
                  
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Até {limit.maxSales} vendas ({limit.percentage}%)</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: 'var(--color-gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--color-gray-600)', fontSize: '14px' }}>
                Plano fixo - sem limites de vendas
              </p>
            )}
          </Card>
        </div>

        <Card title="Histórico de Pagamentos" style={{ marginTop: '32px' }}>
          {subscription?.paymentOrders && subscription.paymentOrders.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-gray-200)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px' }}>Data</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px' }}>Descrição</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px' }}>Valor</th>
                  <th style={{ textAlign: 'center', padding: '12px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {subscription.paymentOrders.map((order, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                    <td style={{ padding: '12px 8px' }}>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td style={{ padding: '12px 8px' }}>Cobrança de assinatura</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                      R$ {order.amount?.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: order.status === 'PAID' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                        color: order.status === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)'
                      }}>
                        {order.status === 'PAID' ? 'Pago' : order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--color-gray-600)', fontSize: '14px' }}>
              Nenhum pagamento registrado ainda.
            </p>
          )}
        </Card>
      </div>
    </AdminClientLayout>
  )
}
