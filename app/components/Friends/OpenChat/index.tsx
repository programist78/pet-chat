import { useState } from 'react'
import styles from './OpenChat.module.scss'
import {GrSend} from 'react-icons/gr'
import { useMutation, useQuery  } from '@apollo/client'
import { onError } from "@apollo/client/link/error";
import { CREATE_MESSAGE } from '@/apollo/messages'
import { useAppSelector } from '@/hooks/type';
import AllMessages from '../AllMessages';

export default function OpenChat(chatId : String) {
    const {info} = useAppSelector((state) => state.info)
    const [content, setContent] = useState("")

    const [sendmessage, {error, loading }] = useMutation(CREATE_MESSAGE)

    const {data, loading: loadingMessages, error: errorMessages} = useQuery()

    function Send() {
        sendmessage({ variables: { postMessageId: chatId?.chatId, user: info[1]?.user?.email, content } }).then(
            () => {
              // apolloClient.resetStore();
              if (loading) return <h1>Adding...</h1>;
              if (error) return <h1 style={{ color: "red" }}>Smt wrong!</h1>;
                setContent("")
            })
    }
  return (
    <div className={styles.back}>
        <div className={styles.messages}>
            {data.messages.map((obj) => (
                <AllMessages 
                user={info[1]?.user?.email} 
                messageUser={obj.user} 
                content={obj.content} 
                id={obj.id}
                key={obj.id}
                />
            ))}
        </div>
        <div className={styles.sendler}>
            <input type="text" value={content} onChange={(e) => setContent(e.target.value)}/>
            <GrSend onClick={Send} className={styles.send}/>
        </div>
    </div>
  )
}
