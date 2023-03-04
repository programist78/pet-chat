import Image from 'next/image'
import styles from './NavBar.module.scss'
import {BiUserPlus} from 'react-icons/bi'
import { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
export default function NavBar() {
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
    
  return (
    <div className={styles.preback}>
        <div className={styles.back}>
            <div className={styles.nav}>
                {openMenu && 
                <animated.div style={props2}>
                <div className={styles.menu}>
                    <p>Login</p>
                    <p>Profile</p>
                    <p>Friends</p>
                </div>
                </animated.div>
                }
                <animated.div style={props}>
                    <Image src="/arrow.svg" width={50} height={50} className={styles.arrow} onClick={() => setOpenMenu(!openMenu)}  alt="icon"/>
                    </animated.div>
                <div className={styles.login_back}>
                    <BiUserPlus />
                </div>
            </div>
        </div>
    </div>
  )
}
