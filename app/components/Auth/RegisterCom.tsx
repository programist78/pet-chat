import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { REGISTER_USER } from '../../apollo/auth'
import { AuthContext } from 'hooks/AuthContext'
import { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import styles from './Auth.module.scss'
import { useSelector, useDispatch } from 'react-redux'

function RegisterCom() {
  const { data: session } = useSession()
  //password options
  const { auth } = useSelector((state) => state.auth)
  const [precentBar, setPrecentBar] = useState('')
  const [passInputChange, setPassInputChange] = useState('')
  const [passInputClasses, setPassInputClasses] = useState('pass-input-passive')
  const [toggleIcon, setToggleIcon] = useState('👀')
  const [toggleIconClasses, setToggleIconClasses] = useState(
    'toggle-icon-passive',
  )
  const [ripple, setRipple] = useState('')
  const [passLabel, setPassLabel] = useState('Strength')
  const [type, setType] = useState('passiwe')
  const [errorsgr, setErrorsgr] = useState('')
  const context = useContext(AuthContext) || ''
  const router = useRouter()
  {
    auth || session ? router.push('/') : ''
  }
  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(5, 'Password must be at least 5 characters')
      .max(40, 'Password must not exceed 40 characters'),
    //   confirm_password: Yup.string()
    //   .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    confirm_password: Yup.string()
      .required('Please retype your password.')
      .oneOf([Yup.ref('password')], 'Your passwords do not match.'),
    acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  function SmartAlert() {
    alert('Log in in your account')
  }

  const [data, setData] = useState()
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER, {
    update() {
      setTimeout(SmartAlert, 1000)
      router.push('/auth/login')
    },
    variables: { about: data },

    // variables: {about: {email: dataEmail, password: dataPassword}},
  })
  if (error) {
    setTimeout(Error, 500)
  }
  function Error() {
    alert('Такой аккаунт уже существует!')
  }
  const onSubmit = (data) => {
    // setDataEmail(data.email)
    // setDataPassword(data.password)
    setData(data)
    setTimeout(registerUser, 500)
    // loginUser()
  }

  const addClass = (className) => {
    setPrecentBar('')
    if (className) {
      setPrecentBar(className)
    }
  }

  const hanglePassInput = (e) => {
    setPassInputChange(e.target.value)
    if (passInputChange.length === 0) {
      setPassLabel('Strength')
      addClass()
    } else if (passInputChange.length <= 4) {
      setPassLabel('Weak')
      addClass('weak')
    } else if (passInputChange.length <= 7) {
      setPassLabel('Not bad')
      addClass('average')
    } else {
      setPassLabel('Strong')
      addClass('strong')
    }
  }

  const togglePassInput = (e) => {
    if (type == 'password') {
      setType('text')
      setToggleIcon('👀')
      setRipple('ripple-active')
      setPassInputClasses('pass-input-active')
      setToggleIconClasses('toggle-icon-active')
    } else {
      setType('password')
      setToggleIcon('👀')
      setRipple('ripple-passive')
      setPassInputClasses('pass-input-passive')
      setToggleIconClasses('toggle-icon-passive')
    }
  }
  return (
    <div className={styles.preback}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.back}>
        <div className={styles.form_group}>
          <label>Fullname</label>
          <input
            name="fullname"
            type="text"
            {...register('fullname')}
            className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.fullname?.message}</div>
        </div>
        <div className={styles.form_group}>
          <label>Email</label>
          <input
            name="email"
            type="text"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div className="input-container">
          <div className="input-group">
            <input
              type={type}
              className={passInputClasses}
              name="password"
              {...register('password')}
              placeholder="Password"
              value={passInputChange}
              onChange={hanglePassInput}
            />
            <span
              onClick={togglePassInput}
              className={`toggle ${toggleIconClasses}`}
            >
              {toggleIcon}
            </span>
            <span className={`ripple ${ripple}`}></span>
          </div>
          <div className="pass-strength">
            <div className="strength-percent">
              <span className={precentBar}></span>
            </div>
            <span className="strength-label">{passLabel}</span>
          </div>
        </div>
        <div className={styles.form_group}>
          <label>Password</label>
          <input
            name="confirm_password"
            type="password"
            {...register('confirm_password')}
            className={`form-control ${
              errors.confirm_password ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.confirm_password?.message}
          </div>
        </div>
        <div className={styles.form_group}>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
          <button
            type="button"
            onClick={reset}
            className="btn btn-warning float-right"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterCom
