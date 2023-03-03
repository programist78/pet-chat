import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.scss'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Pet-chat;
          <code className={styles.code}>webXwizard</code>
        </p>
        <div>
          </div>
      </div>
    </main>
  )
}
