import { useState,useEffect, useRef } from 'react'
import styles from './OpenChat.module.scss'
import {GrSend} from 'react-icons/gr'
import { useMutation, useQuery, useSubscription  } from '@apollo/client'
import { onError } from "@apollo/client/link/error";
import { CREATE_MESSAGE, GET_MESSAGES, SUBSCRIPTION_MESSAGES } from '@/apollo/messages'
import { useAppSelector } from '@/hooks/type';
import AllMessages from '../AllMessages';

export default function OpenChat({chatId } : String) {
    const {info} = useAppSelector((state) => state.info)
    const [content, setContent] = useState("")
    const [allMessages, setAllMessages] = useState([])

    const [sendmessage, {error, loading }] = useMutation(CREATE_MESSAGE)

    const {data, loading: loadingMessages, error: errorMessages} = useQuery(GET_MESSAGES, {variables: {getMessagesId: chatId}})
    const {data: dataSubscription, loading: loadingSubscription, error: errorSubscription} = useSubscription(SUBSCRIPTION_MESSAGES, {variables: {messagesId: chatId}})
    useEffect(() => {
        if (data) {
            setAllMessages(data.getMessages)
        }
    }, [data])
    useEffect(() => {
        if (dataSubscription) {
            setAllMessages(prevMessages => [...prevMessages, dataSubscription?.messages]);
        }
    }, [dataSubscription])
    
    function Send() {
        sendmessage({ variables: { postMessageId: chatId, user: info[1]?.user?.nick, content } }).then(
            () => {
              // apolloClient.resetStore();
              if (loading) return <h1>Adding...</h1>;
              if (error) return <h1 style={{ color: "red" }}>Smt wrong!</h1>;
                setContent("")
            })
    } 
    console.log(dataSubscription)
    const messagesEl = useRef(null);

    useEffect(() => {
        messagesEl.current.scrollTo(0, messagesEl.current.scrollHeight);
      }, [allMessages]);
  return (
    <div className={styles.back}>
        <div className={styles.messages} ref={messagesEl}>
            {allMessages.map((obj) => (
                <AllMessages 
                user={info[1]?.user?.nick} 
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
