import styles from './AllMessages.module.scss'

export default function AllMessages({key, id, user, content, messageUser}) {
  return (
    <div className={styles.back}>
        {user === messageUser ?
        <div className={styles.right}>
            <p className={styles.content}>{content}</p>
        </div>
        :
        <div className={styles.left}>
            <p className={styles.user}>{messageUser}</p>
            <p className={styles.content}>{content}</p>
        </div>
        }
    </div>
  )
}
