import Image from 'next/image'
import styles from './NavBar.module.scss'
import {BiUserPlus} from 'react-icons/bi'
import { useState, useContext,useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import storage from 'redux-persist/lib/storage'
import { useRouter } from 'next/router'
import { useIdleTimer } from 'react-idle-timer'
import { AuthContext } from '../../hooks/AuthContext'

export default function NavBar() {
    const [elapsed, setElapsed] = useState<number>(0)

    const { getElapsedTime } = useIdleTimer({
      timeout: 10_000,
      throttle: 500
    })
  
    useEffect(() => {
      const interval = setInterval(() => {
        setElapsed(Math.ceil(getElapsedTime() / 1000))
      }, 500)
  
      return () => {
        clearInterval(interval)
      }
    })
    const router = useRouter()
    const [openMenu, setOpenMenu] = useState(false)
    const props = useSpring({
        opacity: openMenu ? 0.5 : 1,
        transform: openMenu ? 'rotate(180deg)' : 'rotate(0deg)',
      });

      const props2 = useSpring({
        opacity: openMenu ? 1 : 0.1,
        // margin: openMenu ? 0 : '100px',
        delay: 150,
        transform: openMenu ? 'rotate(360deg)' : 'rotate(100deg)',
      })
      const { user, logout, authredux } = useContext(AuthContext)
      const { auth } = useSelector((state: any) => state.auth)
      const { info } = useSelector((state) => state.info)
      const onLogout = () => {
        logout()
        signOut()
        storage.removeItem('persist:root')
        router.push('/')
        // document.location.reload();
      }
      const currentDate = new Date();
const utcDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);

let timeUTC = utcDate.toUTCString()
  return (
    <div className={styles.preback}>
        <div></div>
        <div className={styles.back}>
            <div className={styles.things}>
                <div className={styles.timer}>{elapsed}</div>
                <div className={styles.timer2}>{timeUTC}</div>
            </div>
            <div className={styles.nav}>
                {openMenu && 
                <animated.div style={props2}>
                <div className={styles.menu}>
                    {auth ?
                    <>
                    <Link href="/profile"><p>Profile</p></Link>
                     <p onClick={onLogout}>Logout</p>
                     </>
                     :
                    <Link href="/auth/login"><p>Login</p></Link>
                    }   
                    <Link href="/friends"><p>Friends</p></Link>
                    <Link href="/"><p>Home</p></Link>
                </div>
                </animated.div>
                }
                <animated.div style={props}>
                    <Image src="/arrow.svg" width={50} height={50} className={styles.arrow} onClick={() => setOpenMenu(!openMenu)}  alt="icon"/>
                    </animated.div>
                <div className={styles.login_back}>
                    {
                        auth 
                        ?
                        <img src={info[1]?.user?.avatarUrl} alt="logo"/>
                        :
                        <BiUserPlus />
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
