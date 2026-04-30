import styles from '../../styles/Layout.module.css'

const menuItems = [
  { path: '/cliente/dashboard', label: 'Minhas Rifas', icon: '🎫' },
  { path: '/cliente/compras', label: 'Minhas Compras', icon: '💰' },
  { path: '/cliente/perfil', label: 'Perfil', icon: '👤' },
]

export default function ClientLayout({ children }) {
  return (
    <div className={styles.layout}>
      <main className={styles.main} style={{ marginLeft: 0 }}>
        {children}
      </main>
    </div>
  )
}
