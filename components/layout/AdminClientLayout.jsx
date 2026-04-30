import Sidebar from '../ui/Sidebar'
import styles from '../../styles/Layout.module.css'

const menuItems = [
  { path: '/admin-cliente/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin-cliente/rifas', label: 'Rifas', icon: '🎟️' },
  { path: '/admin-cliente/relatorios', label: 'Relatórios', icon: '📈' },
  { path: '/admin-cliente/assinatura', label: 'Assinatura', icon: '💳' },
  { path: '/admin-cliente/whatsapp', label: 'WhatsApp', icon: '💬' },
  { path: '/admin-cliente/sorteio', label: 'Sorteio', icon: '🎲' },
]

export default function AdminClientLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar
        items={menuItems}
        logo={<span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>RifasOnline</span>}
        user={{ name: 'Admin Cliente', role: 'Cliente' }}
      />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
