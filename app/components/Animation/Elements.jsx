import styles from './styles.module.scss'

export function LeftMiddle({children}) {
  return (
    <div className={styles.leftmiddle}>
        {children}
    </div>
  )
}

export function FadeIn({children}) {
    return (
      <div className={styles.fadein}>
          {children}
      </div>
    )
  }