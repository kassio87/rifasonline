import AdminClientLayout from '../../components/layout/AdminClientLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from '../../styles/Layout.module.css'

export default function AssinaturaPage() {
  const assinatura = {
    plano: 'Pro Recorrente',
    status: 'Ativa',
    dataInicio: '2026-01-15',
    proximaRenovacao: '2026-05-15',
    valorMensal: 199.90,
    metodoPagamento: 'Cartão de Crédito',
    limiteRifas: 20,
    limiteNumeros: 5000,
    limiteVendasMes: 2000,
    usadoRifas: 8,
    usadoNumeros: 2450,
    usadoVendas: 1250,
  }

  const historico = [
    { data: '2026-04-15', descricao: 'Renovação Mensal', valor: 199.90, status: 'Pago' },
    { data: '2026-03-15', descricao: 'Renovação Mensal', valor: 199.90, status: 'Pago' },
    { data: '2026-02-15', descricao: 'Renovação Mensal', valor: 199.90, status: 'Pago' },
    { data: '2026-01-15', descricao: 'Ativação do Plano', valor: 199.90, status: 'Pago' },
  ]

  return (
    <AdminClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Minha Assinatura</h1>
          <p className={styles.pageSubtitle}>Gerencie seu plano e pagamentos</p>
        </div>

        <div className={styles.gridTwo}>
          <Card title="Detalhes do Plano" subtitle={`Plano ${assinatura.plano}`}>
            <div style={{ 
              padding: '8px 16px', 
              backgroundColor: 'var(--color-success-light)', 
              color: 'var(--color-success)',
              borderRadius: '4px',
              display: 'inline-block',
              marginBottom: '16px',
              fontWeight: 'bold'
            }}>
              {assinatura.status}
            </div>

            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '16px' }}>
              R$ {assinatura.valorMensal.toFixed(2)}<span style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>/mês</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-600)' }}>Data de Início:</span>
                <span>{new Date(assinatura.dataInicio).toLocaleDateString('pt-BR')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-600)' }}>Próxima Renovação:</span>
                <span style={{ fontWeight: 'bold' }}>{new Date(assinatura.proximaRenovacao).toLocaleDateString('pt-BR')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-600)' }}>Método de Pagamento:</span>
                <span>{assinatura.metodoPagamento}</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <Button variant="outline" size="small">Alterar Plano</Button>
              <Button variant="danger" size="small">Cancelar Assinatura</Button>
            </div>
          </Card>

          <Card title="Uso do Plano" subtitle="Limites e utilização atual">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Rifas ({assinatura.usadoRifas}/{assinatura.limiteRifas})</span>
                  <span>{Math.round((assinatura.usadoRifas / assinatura.limiteRifas) * 100)}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--color-gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(assinatura.usadoRifas / assinatura.limiteRifas) * 100}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Números ({assinatura.usadoNumeros.toLocaleString()}/{assinatura.limiteNumeros.toLocaleString()})</span>
                  <span>{Math.round((assinatura.usadoNumeros / assinatura.limiteNumeros) * 100)}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--color-gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(assinatura.usadoNumeros / assinatura.limiteNumeros) * 100}%`, height: '100%', backgroundColor: 'var(--color-info)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Vendas/mês ({assinatura.usadoVendas}/{assinatura.limiteVendasMes})</span>
                  <span>{Math.round((assinatura.usadoVendas / assinatura.limiteVendasMes) * 100)}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--color-gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(assinatura.usadoVendas / assinatura.limiteVendasMes) * 100}%`, height: '100%', backgroundColor: 'var(--color-success)' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Histórico de Pagamentos" style={{ marginTop: '32px' }}>
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
              {historico.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                  <td style={{ padding: '12px 8px' }}>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '12px 8px' }}>{item.descricao}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                    R$ {item.valor.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: 'var(--color-success-light)',
                      color: 'var(--color-success)'
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminClientLayout>
  )
}
