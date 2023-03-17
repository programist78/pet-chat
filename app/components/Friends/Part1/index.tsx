import { GET_USER } from '@/apollo/auth'
import { DELETE_FRIEND, GET_FRIENDS, GET_SENT_FRIENDS, SEND_FRIEND, GET_PENDING_FRIENDS } from '@/apollo/friends'
import { useQuery,useMutation, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './Part1.module.scss'
import { FaUserFriends, FaHourglassEnd } from 'react-icons/fa';
import { BsSendFill } from 'react-icons/bs';
export default function Part1() {
  const [friends, setFriends] = useState();
  const [sendFriends, setSendFriends] = useState();
  const [pendingFriends, setPendingFriends] = useState();
  const [searchUser, setSearchUser] = useState();
  const [presearch, setPreSearch] = useState("");
  const [openTab, setOpenTab] = useState("1")
  const [search, setSearch] = useState("");
  const { info } = useSelector((state) => state.info);

  function SaveInfoClick() {
    setSearch(presearch);
  }

  const [deleteFriend, { loading, error }] = useMutation(DELETE_FRIEND);
  const [addFriend, { loading: addLoading, error: addError }] = useMutation(SEND_FRIEND);

  function deleteFriendClick(toEmail) {
    deleteFriend({ variables: { fromEmail: info[1].user?.email, toEmail } }).then(
      () => {
        // apolloClient.resetStore();
        if (loading) return <h1>Deleting...</h1>;
        if (error) return <h1 style={{ color: "red" }}>Smt wrong!</h1>;
      }
    );
  }

  function addFriendClick(nick) {
    addFriend({ variables: { fromEmail: info[1].user?.email, nick } }).then(
      () => {
        // apolloClient.resetStore();
        if (addLoading) return <h1>Adding...</h1>;
        if (addError) return <h1 style={{ color: "red" }}>Smt wrong!</h1>;
      }
    );
  }

  const [getFriends, { loading: loadingFriends, error: errorFriends, data: friendData }] = useLazyQuery(GET_USER);

  useEffect(() => {
    if (friendData) {
      setSearchUser(friendData);
    }
  }, [friendData]);
console.log(searchUser?.getUser)

  const { loading: getFriendsLoading, error: getFriendsError, data } = useQuery(GET_FRIENDS, {
    skip: !info[1]?.user?.email,
    variables: { email: info[1]?.user?.email }
  });

    useEffect(() => {
    if (data) {
      setFriends(data);
    }
  }, [data]);

  const { loading: getSendingLoading, error: getSendingError, data: getSendingData } = useQuery(GET_SENT_FRIENDS, {
    skip: !info[1]?.user?.email,
    variables: { email: info[1]?.user?.email }
  });

    useEffect(() => {
    if (getSendingData) {
      setSendFriends(getSendingData);
    }
  }, [getSendingData]);

  const { loading: getPendingLoading, error: getPendingError, data: getPendingData } = useQuery(GET_PENDING_FRIENDS, {
    skip: !info[1]?.user?.email,
    variables: { email: info[1]?.user?.email }
  });

    useEffect(() => {
    if (getPendingData) {
      setPendingFriends(getPendingData);
    }
  }, [getPendingData]);

  if (loading || loadingFriends || getFriendsLoading || getSendingLoading || getPendingLoading) return <h1>Loading...</h1>;


  return (
    <div className={styles.preback}>
    <div className={styles.back}>
      {openTab == "1" &&
      <>
        <p className={styles.title}>Friends</p>
        <div className={styles.input_div}>
        <p>Input email or nickname</p>
        <input type="text" value={presearch} onChange={(e) => setPreSearch(e.target.value)} />
        {/* {errorFriends && <p>such as are not found</p>} */}
        <button onClick={() => getFriends({ variables: { input: presearch }}) }>Search</button>
        <div>
   
        </div>
        
        </div>
        {searchUser &&
        <div className={styles.friend}>
                        <div className={styles.info}>
                            <img src={searchUser?.getUser?.imageUrl} alt=""/>
                    <div className={styles.nickname}>
                    <p className={styles.nick}>{searchUser?.getUser?.nick}</p>
                        <p className={styles.email}>{searchUser?.getUser?.email}</p>
                    </div>
                    </div>
                <div className={styles.buttons}>
                    <button className={styles.chat}>Chat</button>
                    <button className={styles.delete} onClick={() => addFriendClick(searchUser?.getUser?.nick)}>Add</button>
                </div>
                </div>
        }
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
        </>
        }
         {openTab == "2" &&
      <>
        <p className={styles.title}>Submitted requests</p>
        <div className={styles.grid}>
                    {sendFriends?.getSent?.map((obj, key) => (
                        <div className={styles.friend}>
                        <div className={styles.info}>
                            <img src="" alt=""/>
                    <div className={styles.nickname} key={key}>
                    <p className={styles.nick}>{obj.nick}</p>
                        <p className={styles.email}>{obj.email}</p>
                    </div>
                    </div>
                {/* <div className={styles.buttons}>
                    <button className={styles.chat}>Chat</button>
                    <button className={styles.delete} onClick={() => deleteFriendClick(obj.email)} >Delete</button>
                </div> */}
                </div>
          ))}
        </div>
        </>
        }
        {openTab == "3" &&
      <>
      <p className={styles.title}>Pending requests</p>
        <div className={styles.grid}>
                    {pendingFriends?.getPending?.map((obj, key) => (
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
        </>
        }
    </div>
    <div className={styles.icons}>
      <div>
      <FaUserFriends onClick={() => setOpenTab("1")}  className={openTab == "1" ? styles.icon_active : styles.icon}/>
      </div>
      <div>
      <BsSendFill onClick={() => setOpenTab("2")}  className={openTab == "2" ? styles.icon_active : styles.icon}/>
      </div>
      <div>
      <FaHourglassEnd onClick={() => setOpenTab("3")}  className={openTab == "3" ? styles.icon_active : styles.icon}/>
      </div>
      
    </div>
    </div>
  )
}
