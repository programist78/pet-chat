import '../styles/globals.scss'
import { InMemoryCache } from '@apollo/client/cache'
import { ApolloClient } from '@apollo/client/core/ApolloClient.js'
import { createUploadLink } from 'apollo-upload-client'
import nextApp, { AppContext } from 'next/app.js'
import { createElement as h, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import { appWithTranslation } from 'next-i18next'
import * as core from '@apollo/client/core'
import type { AppProps } from 'next/app'
import { Orbitron } from '@next/font/google'
import RootLayout from '../components/RootLayout'
const orbitron = Orbitron({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})
const createApolloClient = (cache = {}) =>
  new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache().restore(cache),
    link: createUploadLink({
      uri: process.env.API_URI,
      credentials: 'include',
    }),
  })
export const apolloClient = createApolloClient(core.ApolloCache)

const App = ({
  Component,
  pageProps,
}: // apolloCache,
// apolloClient
AppProps) => {
  const [loadingcomponent, setLoadingcomponent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setLoadingcomponent(true)
    })
    router.events.on('routeChangeComplete', () => {
      setLoadingcomponent(false)
    })
  }, [])
  const [showChild, setShowChild] = useState(false)
  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }

  if (typeof window === 'undefined') {
    return <></>
  }
  return (
    <>
              {
                loadingcomponent ? (
                  // <Loader />
                  <h1>Loading....</h1>
                ) : (
                <>
                    {/* <Head></Head> */}
                    <RootLayout>
                           <main className={orbitron.className}>
                          <Component {...pageProps} />
                             </main>
                             </RootLayout>
                        </>
                )
               
              }
    </>
  )
}
if (typeof window === 'undefined')
  App.getInitialProps = async function getInitialProps(context: AppContext) {
    const apolloClient = createApolloClient()
    const [props, { default: ReactDOMServer }, { getMarkupFromTree }] =
      await Promise.all([
        nextApp.getInitialProps(context),
        import('react-dom/server'),
        import('@apollo/client/react/ssr/getDataFromTree.js'),
      ])

    const apolloCache = apolloClient.cache.extract()

    return {
      ...props,
      apolloCache,
    }
  }

export default 
// appWithTranslation
(App)
