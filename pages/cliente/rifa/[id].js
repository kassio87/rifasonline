import { useRouter } from 'next/router'
import ClientLayout from '../../../components/layout/ClientLayout'
import styles from '../../../styles/Layout.module.css'

export default function ClienteRifaView() {
  const router = useRouter()
  const { id } = router.query

  // Dados estáticos de exemplo
  const rifa = {
    id: id || 1,
    titulo: 'Rifa iPhone 15 Pro Max',
    descricao: 'Concorra a um iPhone 15 Pro Max novinho!',
    preco: 10,
    totalNumeros: 500,
    numerosDisponiveis: 355,
    numerosReservados: 120,
    numerosPagos: 25,
  }

  // Gerar lista de números (exemplo: 1-20)
  const numeros = []
  for (let i = 1; i <= 20; i++) {
    let status = 'available'
    let comprador = null
    
    if (i <= 5) {
      status = 'paid'
      comprador = { nome: 'João Silva', telefone: '554199999999' }
    } else if (i <= 10) {
      status = 'reserved'
      comprador = { nome: 'Maria Souza', telefone: '554198888888' }
    }
    
    numeros.push({ numero: i, status, comprador })
  }

  const getStatusEmoji = (status) => {
    switch(status) {
      case 'available': return '✅'
      case 'reserved': return '🔍'
      case 'paid': return '💰'
      default: return '✅'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'available': return 'Disponível'
      case 'reserved': return 'Reservado'
      case 'paid': return 'Pago'
      default: return 'Disponível'
    }
  }

  return (
    <ClientLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{rifa.titulo}</h1>
          <p className={styles.pageSubtitle}>{rifa.descricao}</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            padding: '16px', 
            backgroundColor: 'var(--color-white)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: '8px' }}>Preço por Número</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>R$ {rifa.preco}</div>
          </div>
          
          <div style={{ 
            padding: '16px', 
            backgroundColor: 'var(--color-white)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: '8px' }}>Progresso</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                flex: 1, 
                height: '8px', 
                backgroundColor: 'var(--color-gray-200)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${((rifa.totalNumeros - rifa.numerosDisponiveis) / rifa.totalNumeros) * 100}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--color-primary)' 
                }} />
              </div>
              <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                {rifa.totalNumeros - rifa.numerosDisponiveis}/{rifa.totalNumeros}
              </span>
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'var(--color-white)',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ marginBottom: '16px' }}>Lista de Números</h2>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: '24px' }}>
            Como reservar: No grupo do WhatsApp, envie "Quero X" ou "Quero X ao Y" (ex: "Quero 5" ou "Quero 5 ao 10")
          </p>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {numeros.map((num) => (
              <div 
                key={num.numero}
                style={{ 
                  padding: '12px',
                  border: `1px solid ${
                    num.status === 'paid' ? 'var(--color-success)' : 
                    num.status === 'reserved' ? 'var(--color-warning)' : 
                    'var(--color-gray-200)'
                  }`,
                  borderRadius: '6px',
                  backgroundColor: 
                    num.status === 'paid' ? 'var(--color-success-light)' : 
                    num.status === 'reserved' ? 'var(--color-warning-light)' : 
                    'var(--color-white)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{num.numero}</span>
                  <span style={{ fontSize: '20px' }}>{getStatusEmoji(num.status)}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-600)', marginTop: '4px' }}>
                  {getStatusText(num.status)}
                </div>
                {num.comprador && (
                  <div style={{ fontSize: '11px', color: 'var(--color-gray-600)', marginTop: '4px' }}>
                    {num.comprador.nome}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          marginTop: '32px',
          padding: '16px',
          backgroundColor: 'var(--color-primary-light)',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <strong>💡 Dica:</strong> Para reservar seus números, entre no grupo do WhatsApp e use os comandos aceitos!
        </div>
      </div>
    </ClientLayout>
  )
}
