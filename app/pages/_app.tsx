import '../styles/globals.scss'
import { InMemoryCache } from '@apollo/client/cache'
import { ApolloClient } from '@apollo/client/core/ApolloClient.js'
import nextApp, { AppContext } from 'next/app.js'
import { createElement as h, useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import store, { persistor } from '../redux/store'
import { useRouter } from 'next/router'
import { ApolloCache } from '@apollo/client/core'
import { AuthProvider } from '../hooks/AuthContext.jsx'
import { SessionProvider } from 'next-auth/react'
import { PersistGate } from 'redux-persist/integration/react'
import Loader from '../components/Loader'
// import { appWithTranslation } from 'next-i18next'
import * as core from '@apollo/client/core'
import type { AppProps } from 'next/app'
import { Orbitron } from '@next/font/google'
import RootLayout from '../components/RootLayout'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink, from, ApolloProvider } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from "@apollo/client/link/ws";
import Router from 'next/router'
import NProgress from 'nprogress'
import { onError } from "@apollo/client/link/error";
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());
// import 'nprogress/nprogress.css';
import '../styles/Nprogress.scss';
const orbitron = Orbitron({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

const wsLink = 
typeof window !== "undefined"
  ?
  new GraphQLWsLink(createClient({
  url: "ws://localhost:4000/graphql"
})) : null;
  // const wsLink = new GraphQLWsLink({
  //   uri: "ws://localhost:4000",
  //   options: {
  //     reconnect: true,
  //   },
  // });
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const splitLink = 
typeof window !== "undefined" && wsLink != null
?
  split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
): httpLink;
const createApolloClient = (cache = {}) =>
  new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache().restore(cache),
    link: from([errorLink, splitLink])
    // createUploadLink({
    //   uri: process.env.API_URI,
    //   credentials: 'include',
    // }),
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
    <SessionProvider session={pageProps.session}>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <AuthProvider>
            <PersistGate persistor={persistor}>
              {/* {loadingcomponent ? (
                <Loader />
              ) : ( */}
                <>
                  {/* <Head></Head> */}
                  <RootLayout>
                    <main className={orbitron.className}>
                      <Component {...pageProps} />
                    </main>
                  </RootLayout>
                </>
              {/* )} */}
            </PersistGate>
          </AuthProvider>
        </Provider>
      </ApolloProvider>
    </SessionProvider>
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
