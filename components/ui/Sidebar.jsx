import { useRouter } from 'next/router'
import styles from './Sidebar.module.css'

export default function Sidebar({ items, logo, user, footerContent }) {
  const router = useRouter()

  const handleNavigation = (path) => {
    router.push(path)
  }

  return (
    <div className={styles.sidebar}>
      {logo && (
        <div className={styles.logo}>
          {logo}
        </div>
      )}
      
      <nav className={styles.menu}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.menuItem} ${
              router.pathname.startsWith(item.path) ? styles.active : ''
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </nav>

      {(user || footerContent) && (
        <div className={styles.footer}>
          {footerContent || (
            user && (
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userRole}>{user.role}</div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
