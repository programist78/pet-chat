import jwtDecode from 'jwt-decode'
import { useReducer, createContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addUsertoLocal } from '../redux/slices/auth'
const initialState = {
  user: null,
}

// const AuthContext = React.createContext<UserCtx | "">("");

//old variant
const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
})

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      }
    default:
      return state
  }
}

function AuthProvider(props) {
  useEffect(() => {
    if (localStorage.getItem('token')) {
      const decodedToken = jwtDecode(localStorage.getItem('token') || '')
      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
      } else {
        dispatch({
          type: 'LOGIN',
          payload: decodedToken,
        })
      }
    }
  }, [])

  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = (userData) => {
    localStorage.setItem('token', userData.token)
    dispatch({
      type: 'LOGIN',
      payload: userData,
    })
  }

  function logout() {
    localStorage.removeItem('token')
    dispatch({
      type: 'LOGOUT',
      payload: undefined,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout,
        // authredux
      }}
      {...props}
    />
  )
}

export { AuthContext, AuthProvider }

function dispatch(arg0) {
  throw new Error('Function not implemented.')
}
