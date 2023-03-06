import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../hooks/AuthContext'
import { useQuery } from '@apollo/client'
import { GET_USER } from '../apollo/auth.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import NavBar from './NavBar'
import { addUsertoLocal } from '../redux/slices/auth'
import { addAdmintoLocal } from '../redux/slices/roles/admin'
import { addPeopletoLocal } from '../redux/slices/roles/people'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isPeople, setIsPeople] = useState()
  const { user, logout, authredux } = useContext(AuthContext)

  if (user?.email?.role == 'ADMIN') {
    dispatch(addAdmintoLocal(user?.email?.role))
  }
  if (user?.email?.role == 'USER') {
    dispatch(addPeopletoLocal(user?.email?.role))
  }
  {
    user ? dispatch(addUsertoLocal(user)) : null
  }
  const { auth } = useSelector((state) => state.auth)
  const { admin } = useSelector((state) => state.admin)
  const { people } = useSelector((state) => state.people)
  return (
    <>
      <>
        <NavBar />
        {children}
      </>
    </>
  )
}
