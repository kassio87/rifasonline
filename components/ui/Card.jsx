import styles from './Card.module.css'

export default function Card({ 
  title, 
  subtitle, 
  children, 
  footer, 
  headerContent,
  className = '' 
}) {
  return (
    <div className={`${styles.card} ${className}`}>
      {(title || headerContent) && (
        <div className={styles.header}>
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {headerContent && <div>{headerContent}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}
