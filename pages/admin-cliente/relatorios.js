import { useState, useEffect } from 'react'
import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { getSalesReport } from '../../lib/api'
import styles from '../../styles/Layout.module.css'

export default function RelatoriosPage() {
  const [salesData, setSalesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReport()
  }, [])

  async function loadReport() {
    try {
      setLoading(true)
      const data = await getSalesReport()
      setSalesData(data)
    } catch (err) {
      setError('Erro ao carregar relatório')
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

  const vendasPorDia = salesData?.sales?.reduce((acc, sale) => {
    const data = new Date(sale.createdAt).toLocaleDateString('pt-BR')
    const existing = acc.find(item => item.data === data)
    if (existing) {
      existing.vendas += 1
      existing.valor += sale.totalAmount
    } else {
      acc.push({ data, vendas: 1, valor: sale.totalAmount })
    }
    return acc
  }, []).slice(0, 7) || []

  const topRifas = salesData?.sales?.reduce((acc, sale) => {
    const rifaNome = sale.raffle?.title || 'Sem nome'
    const existing = acc.find(item => item.nome === rifaNome)
    if (existing) {
      existing.vendidos += 1
      existing.receita += sale.totalAmount
    } else {
      acc.push({ nome: rifaNome, vendidos: 1, receita: sale.totalAmount })
    }
    return acc
  }, []).sort((a, b) => b.receita - a.receita).slice(0, 3) || []

  const totalVendas = salesData?.summary?.totalSales || 0
  const totalReceita = salesData?.summary?.totalAmount || 0

  return (
    <AdminClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Relatórios de Vendas</h1>
          <p className={styles.pageSubtitle}>Acompanhe o desempenho das suas rifas</p>
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

        <div className={styles.gridThree} style={{ marginBottom: '32px' }}>
          <Card title="Total de Vendas">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              {totalVendas}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>Números vendidos</div>
          </Card>
          <Card title="Receita Total">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-success)' }}>
              R$ {totalReceita.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>Faturamento</div>
          </Card>
          <Card title="Ticket Médio">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-info)' }}>
              R$ {totalVendas > 0 ? (totalReceita / totalVendas).toFixed(2) : '0.00'}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>Por número</div>
          </Card>
        </div>

        <div className={styles.gridTwo}>
          <Card title="Vendas por Dia (Recentes)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {vendasPorDia.map((venda, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px' }}>
                      {venda.data}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {venda.vendas} vendas - R$ {venda.valor.toFixed(2)}
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: 'var(--color-gray-200)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min((venda.vendas / 70) * 100, 100)}%`,
                      height: '100%',
                      backgroundColor: 'var(--color-primary)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Top Rifas por Receita">
            {topRifas.map((rifa, i) => (
              <div key={i} style={{
                padding: '12px 0',
                borderBottom: i < topRifas.length - 1 ? '1px solid var(--color-gray-200)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{rifa.nome}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-gray-600)' }}>
                  <span>{rifa.vendidos} vendidos</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>
                    R$ {rifa.receita.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <Card title="Exportar Relatórios" style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="outline" size="small">📊 Exportar Excel</Button>
            <Button variant="outline" size="small">📄 Exportar PDF</Button>
            <Button variant="outline" size="small">📈 Relatório Completo</Button>
          </div>
        </Card>
      </div>
    </AdminClientLayout>
  )
}
