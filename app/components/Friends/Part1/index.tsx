import { GET_USER } from '@/apollo/auth'
import { DELETE_FRIEND, GET_FRIENDS } from '@/apollo/friends'
import { useQuery,useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './Part1.module.scss'
// import { IoChatboxOutline } from 'react-icons/io';
export default function Part1() {
    const [friends, setFriends] = useState()
    const [presearch, setPreSearch] = useState("")
    const [search, setSearch] = useState("")
    const { info } = useSelector((state) => state.info);
    function SaveInfoClick() {
      setSearch(presearch)
    }
    
    const [deleteFriend, {loading, error}] = useMutation(DELETE_FRIEND)
    function deleteFriendClick(toEmail) {
        deleteFriend({ variables: { fromEmail: info[1].user?.email, toEmail} }).then(
          () => {
            // apolloClient.resetStore();
            if (loading) return <h1>Deleting...</h1>
            if (error) return <h1 style={{color: "red"}} >Smt wrong!</h1>
          },
        )
      }
    if (info[1]?.user?.email) {
    const { loading, error, data } = useQuery(GET_FRIENDS, {
        skip: !info[1]?.user?.email,
        variables: { email: info[1]?.user?.email }
      })
      useEffect(() => {
        setFriends(data)
      }, [data])
      if (loading) return <h1>Loading...</h1>
    }
    if (search) {
      const { loading, error, data } = useQuery(GET_USER, {
        skip: !search,
          variables: { email: search }
        })
        if (error) return <h1>User isn't find</h1>
        
        useEffect(() => {
          setFriends(data)
        }, [data])
        if (loading) return <h1>Loading...</h1>
      }


  return (
    <div className={styles.preback}>
    <div className={styles.back}>

        <p className={styles.title}>Friends</p>
        <div className={styles.input_div}>
        <p>Input email or nickname</p>
        <input type="text" value={presearch} onChange={(e) => setPreSearch(e.target.value)} />
        <button onClick={SaveInfoClick}>Search</button>
        </div>
        <div className={styles.grid}>
                    {friends?.getFriends?.map((obj, key) => (
                        <div className={styles.friend}>
                        <div className={styles.info}>
                            <img src="" alt=""/>
                    <div className={styles.nickname} key={key}>
                    <p className={styles.nick}>{obj.nick}</p>
                        <p className={styles.email}>{obj.email}</p>
                    </div>
                    </div>
                <div className={styles.buttons}>
                    <button className={styles.chat}>Chat</button>
                    <button className={styles.delete} onClick={() => deleteFriendClick(obj.email)} >Delete</button>
                </div>
                </div>
          ))}
        </div>
    </div>
    </div>
  )
}
