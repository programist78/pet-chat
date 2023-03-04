import styles from './Chat.module.scss'
import {TbCubeSend} from 'react-icons/tb'
export default function Chat() {
  return (
    <div className={styles.back}>
        <div className={styles.chat_window}></div>
        <div className={styles.sendler}>
            <input type="text"/>
            <TbCubeSend className={styles.send}/>
        </div>
    </div>
  )
}
