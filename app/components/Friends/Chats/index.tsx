import { useEffect, useState } from 'react'
import styles from './Chats.module.scss'
import { useSelector } from 'react-redux';
import OpenChat from '../OpenChat';

const Chat = ({
   user1, 
   user2,
   lastMessage,
   chatId
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState()
    const { info } = useSelector((state) => state.info);
    useEffect(() => {
        if (user1 == info[1]?.user?.email){
            setName(user2)
        }else {
            setName(user1)
        }
    }, [user1])
    

  return (
    <>
    {isOpen ?
    <OpenChat chatId={chatId}/>
    :
    <div className={styles.back} onClick={() => setIsOpen(!isOpen)}>
    <img alt='user' src='/logo.png' className={styles.logo}/>
    <div className={styles.info}>
    <p className={styles.name}>{name}</p>
    <div className={styles.lastMessage}>
    <p className={styles.user}>{lastMessage.user}:</p>
    <p className={styles.content}>{lastMessage.content}</p>
    </div>
    </div>
    </div>
  }
    </>
  )
}

export default Chat