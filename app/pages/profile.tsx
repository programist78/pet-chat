import { useContext, useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { AuthContext } from '../hooks/AuthContext'
import { GET_USER, SEND_FRIEND } from '../apollo/auth'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { GoPencil } from 'react-icons/go'
import { CHANGE_USER_LOGO } from '../apollo/auth'
import { useMutation } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react/hooks/useApolloClient.js'
import Swal from 'sweetalert2'
import styles from '../styles/profile.module.scss'

export default function GetMe() {

  const [errors, setErrors] = useState([])
  const [findF, setFindF] = useState([])
  const router = useRouter()
  const { auth } = useSelector((state) => state.auth)
  const { info } = useSelector((state) => state.info)
  {!auth && router.push('/')}

  const [changeUserLogo] = useMutation(CHANGE_USER_LOGO, {
    onError({ graphQLErrors }) {
      setErrors(graphQLErrors)
      console.log(errors)
    },
  })
  // const [sendFriend, {error, data}] = useMutation(SEND_FRIEND, {
  // })
  const apolloClient = useApolloClient()

  function onChangeCP({ target: { validity, files } }) {
    if (validity.valid && files && files[0])
      changeUserLogo({
        variables: { file: files, changeUserLogoId: data?.getUser.id },
      }).then(() => {
        apolloClient.resetStore()
      })
  }

  // function sendClick() {
  //   sendFriend({
  //     variables: {
  //       fromEmail: info[1]?.user?.email, nick: findF 
  //     },
  //   }).then(() => {
  //     Swal.fire("Request were send!")
  //   })
  // }

  // if (error) return Swal.fire("Undefined nick")
  return (
    <div className={styles.preback}>
      <div className={styles.back}>
        <div className={styles.part1}>
          <p>Your email:</p>
          <h2>{info[1]?.user?.email}</h2>
          <p>Your nick:</p>
          <h1>{info[1]?.user?.nick}</h1>
          <p>Your role:</p>
          <h3>{info[1]?.user?.role}</h3>
          <p>Your id:</p>
          <h3>{info[1]?.user?.id}</h3>
          <p>Your friends:</p>
          {(info[1]?.user?.friends)?.map(obj => 
            <div style={{backgroundColor: "whitesmoke", borderRadius: "5px", padding: "10px"}}>
            <h3>{obj.email}</h3>
            <br />
            <h3>{obj.nick}</h3>
            </div>
          )}
        </div>
        <div className={styles.part2}>
          <input type="file" required onChange={onChangeCP} />
          <img
            className={styles.avatar}
            src={info[1]?.user?.avatarUrl}
            alt="logo"
          />
          <div className={styles.find_friend}>
          <input type="text" value={findF}  onChange={(e) => setFindF(e.target.value)} />
          {/* <button onClick={sendClick}>Find!</button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
