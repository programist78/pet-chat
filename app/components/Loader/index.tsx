import styles from './Loader.module.scss'

export default function Spinner() {
  return (
    <div className={styles.spinner}>
      <div className={styles.dot1}></div>
      <div className={styles.dot2}></div>
    </div>
  )
}
