import Sidebar from '../ui/Sidebar'
import styles from '../../styles/Layout.module.css'

const menuItems = [
  { path: '/admin-sistema/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin-sistema/planos', label: 'Gestão Planos', icon: '📋' },
  { path: '/admin-sistema/admins', label: 'Admins Cliente', icon: '👥' },
  { path: '/admin-sistema/configuracoes', label: 'Configurações', icon: '⚙️' },
]

export default function AdminSystemLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar
        items={menuItems}
        logo={<span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>RifasOnline</span>}
        user={{ name: 'Admin Sistema', role: 'Administrador' }}
      />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
