import ClientLayout from '../../components/layout/ClientLayout'
import Card from '../../components/ui/Card'
import styles from '../../styles/Layout.module.css'

export default function ClienteDashboard() {
  const rifas = [
    { id: 1, titulo: 'Rifa iPhone 15', numerosDisponiveis: 355, totalNumeros: 500, preco: 10 },
    { id: 2, titulo: 'Rifa Viagem Cancún', numerosDisponiveis: 111, totalNumeros: 200, preco: 50 },
  ]

  return (
    <ClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Minhas Rifas</h1>
          <p className={styles.pageSubtitle}>Reserve seus números e participe!</p>
        </div>

        <div className={styles.gridTwo}>
          {rifas.map((rifa) => {
            const vendidos = rifa.totalNumeros - rifa.numerosDisponiveis
            const porcentagem = (vendidos / rifa.totalNumeros) * 100
            
            return (
              <Card key={rifa.id} title={rifa.titulo}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Progresso</span>
                    <span style={{ fontWeight: 'bold' }}>{vendidos}/{rifa.totalNumeros}</span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: 'var(--color-gray-200)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${porcentagem}%`, 
                      height: '100%', 
                      backgroundColor: 'var(--color-primary)' 
                    }} />
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    R$ {rifa.preco}
                    <span style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>/número</span>
                  </div>
                  <button 
                    onClick={() => window.location.href = `/cliente/rifa/${rifa.id}`}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Ver Números
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </ClientLayout>
  )
}
