import { useState } from 'react'
import AdminSystemLayout from '../../components/layout/AdminSystemLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import styles from '../../styles/Layout.module.css'

export default function GestaoPlanos() {
  const [showModal, setShowModal] = useState(false)
  const [tipoPlano, setTipoPlano] = useState('recorrente')
  
  const planos = [
    {
      id: 1,
      nome: 'Básico Recorrente',
      tipo: 'recorrente',
      preco: 99.90,
      limiteRifas: 5,
      limiteNumeros: 1000,
      limiteVendasMes: 500,
      status: 'ativo'
    },
    {
      id: 2,
      nome: 'Pro Recorrente',
      tipo: 'recorrente',
      preco: 199.90,
      limiteRifas: 20,
      limiteNumeros: 5000,
      limiteVendasMes: 2000,
      status: 'ativo'
    },
    {
      id: 3,
      nome: 'Single Event',
      tipo: 'fixo',
      preco: 149.90,
      limiteRifas: 1,
      limiteNumeros: 2000,
      limiteVendasMes: null,
      validadeDias: 30,
      status: 'ativo'
    }
  ]

  return (
    <AdminSystemLayout>
      <div className={styles.container}>
        <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className={styles.pageTitle}>Gestão de Planos</h1>
            <p className={styles.pageSubtitle}>Criar e gerenciar planos recorrentes e fixos</p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Novo Plano
          </Button>
        </div>

        <div className={styles.gridTwo}>
          {planos.map((plano) => (
            <Card key={plano.id} title={plano.nome}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  backgroundColor: plano.tipo === 'recorrente' ? 'var(--color-info-light)' : 'var(--color-warning-light)',
                  color: plano.tipo === 'recorrente' ? 'var(--color-info)' : 'var(--color-warning)'
                }}>
                  {plano.tipo === 'recorrente' ? 'Recorrente' : 'Fixo'}
                </span>
              </div>
              
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '16px' }}>
                R$ {plano.preco.toFixed(2)}
                {plano.tipo === 'recorrente' && <span style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>/mês</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-gray-600)' }}>Limite Rifas:</span>
                  <span style={{ fontWeight: 'bold' }}>{plano.limiteRifas}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-gray-600)' }}>Limite Números:</span>
                  <span style={{ fontWeight: 'bold' }}>{plano.limiteNumeros.toLocaleString()}</span>
                </div>
                {plano.limiteVendasMes && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-600)' }}>Vendas/mês:</span>
                    <span style={{ fontWeight: 'bold' }}>{plano.limiteVendasMes.toLocaleString()}</span>
                  </div>
                )}
                {plano.validadeDias && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-gray-600)' }}>Validade:</span>
                    <span style={{ fontWeight: 'bold' }}>{plano.validadeDias} dias</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <Button variant="outline" size="small">Editar</Button>
                <Button variant="danger" size="small">Excluir</Button>
              </div>
            </Card>
          ))}
        </div>

        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px'
            }}>
              <h2 style={{ marginBottom: '16px' }}>Novo Plano</h2>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Tipo de Plano</label>
                <select 
                  value={tipoPlano} 
                  onChange={(e) => setTipoPlano(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-gray-300)' }}
                >
                  <option value="recorrente">Recorrente (Mensal)</option>
                  <option value="fixo">Fixo (Único)</option>
                </select>
              </div>

              <Input label="Nome do Plano" placeholder="Ex: Premium" />
              <Input label="Preço (R$)" type="number" placeholder="99.90" />
              <Input label="Limite de Rifas" type="number" placeholder="10" />
              <Input label="Limite de Números por Rifa" type="number" placeholder="1000" />
              
              {tipoPlano === 'recorrente' ? (
                <Input label="Limite de Vendas por Mês" type="number" placeholder="500" />
              ) : (
                <Input label="Validade (dias)" type="number" placeholder="30" />
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" fullWidth>
                  Criar Plano
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSystemLayout>
  )
}
