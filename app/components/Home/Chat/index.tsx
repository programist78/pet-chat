import styles from './Chat.module.scss'
import {TbCubeSend} from 'react-icons/tb'
import {GET_MESSAGES} from '../../../apollo/messages'
import { useSubscription } from '@apollo/client'
export default function Chat() {
  const { data, loading } = useSubscription(
    GET_MESSAGES
  );
  return (
    <div className={styles.back}>
        <div className={styles.chat_window}>
          <h1>{data?.messages?.content}</h1>
          <h1>{data?.messages?.user}</h1>
        </div>
        <div className={styles.sendler}>
            <input type="text"/>
            <TbCubeSend className={styles.send}/>
        </div>
    </div>
  )
}
