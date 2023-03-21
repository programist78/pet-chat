import styles from './Chat.module.scss'
import {TbCubeSend} from 'react-icons/tb'
import {CREATE_MESSAGE, GET_MESSAGES} from '../../../apollo/messages'
import { useMutation, useSubscription } from '@apollo/client'
import { useSelector } from 'react-redux'
import { useState } from 'react'
export default function Chat() {
  const { info } = useSelector((state) => state.info);
  const [text, setText] = useState("")
  const [createMessage, {error: sendError, loading: LoadingError}] = useMutation(CREATE_MESSAGE)
  function Click(text) {
    createMessage({
      variables: {
        user: info[1].user?.email, content: text
      }
    })
  }

  // if (!data) return null
  return (
    <div className={styles.back}>
    {/* <div className={styles.chat_window}>
    {data?.messages?.map((obj, key) => (
                    <div className={styles.chat_window} key={key}>
                    <p className={styles.nick}>{obj.user}</p>
                        <p className={styles.email}>{obj.content}</p>
                    </div>
          ))}
        </div> 
        <div className={styles.sendler}>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            <TbCubeSend className={styles.send} onClick={() => Click(text)}/>
        </div> */}
    </div>
  )
}
