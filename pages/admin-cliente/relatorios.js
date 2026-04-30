import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from '../../styles/Layout.module.css'

export default function RelatoriosPage() {
  const vendasPorDia = [
    { data: '2026-04-24', vendas: 45, valor: 1125.00 },
    { data: '2026-04-25', vendas: 52, valor: 1300.00 },
    { data: '2026-04-26', vendas: 38, valor: 950.00 },
    { data: '2026-04-27', vendas: 61, valor: 1525.00 },
    { data: '2026-04-28', vendas: 48, valor: 1200.00 },
    { data: '2026-04-29', vendas: 55, valor: 1375.00 },
    { data: '2026-04-30', vendas: 43, valor: 1075.00 },
  ]

  const topRifas = [
    { nome: 'Rifa iPhone 15 Pro', vendidos: 145, receita: 3625.00 },
    { nome: 'Rifa TV 75" 8K', vendidos: 280, receita: 14000.00 },
    { nome: 'Rifa Viagem Cancún', vendidos: 89, receita: 8900.00 },
  ]

  const totalVendas = vendasPorDia.reduce((acc, v) => acc + v.vendas, 0)
  const totalReceita = vendasPorDia.reduce((acc, v) => acc + v.valor, 0)

  return (
    <AdminClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Relatórios de Vendas</h1>
          <p className={styles.pageSubtitle}>Acompanhe o desempenho das suas rifas</p>
        </div>

        <div className={styles.gridThree} style={{ marginBottom: '32px' }}>
          <Card title="Total de Vendas (7 dias)">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              {totalVendas}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>Números vendidos</div>
          </Card>
          <Card title="Receita Total (7 dias)">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-success)' }}>
              R$ {totalReceita.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>Faturamento</div>
          </Card>
          <Card title="Ticket Médio">
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-info)' }}>
              R$ {(totalReceita / totalVendas).toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>Por número</div>
          </Card>
        </div>

        <div className={styles.gridTwo}>
          <Card title="Vendas por Dia (Últimos 7 dias)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {vendasPorDia.map((venda, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px' }}>
                      {new Date(venda.data).toLocaleDateString('pt-BR')}
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
                      width: `${(venda.vendas / 70) * 100}%`, 
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
