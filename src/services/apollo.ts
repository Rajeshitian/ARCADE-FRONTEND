import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { useAuthStore } from '@/store/authStore'

const GRAPHQL_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/graphql`

// ─── HTTP Link ────────────────────────────────────────────────────────────────
const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
})

// ─── Auth Link — injects JWT into every request ───────────────────────────────
const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
})

// ─── Error Link ───────────────────────────────────────────────────────────────
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error(
        `[GraphQL error] ${err.extensions?.code ?? 'UNKNOWN'}: ${err.message}`,
        { path: err.path, locations: err.locations }
      )

      // Token expired or invalid → logout and go to login
      if (
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.extensions?.code === '401' ||
        err.message?.toLowerCase().includes('unauthorized') ||
        err.message?.toLowerCase().includes('unauthenticated')
      ) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
  }

  if (networkError) {
    console.error('[Network error]:', networkError)

    // HTTP 401 from network layer
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
  }
})

// ─── Retry Link — retries failed requests up to 3 times ──────────────────────
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 2000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => {
      // Don't retry auth errors
      if ('statusCode' in error && error.statusCode === 401) return false
      return !!error
    },
  },
})

// ─── Apollo Cache ─────────────────────────────────────────────────────────────
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        employees: {
          keyArgs: ['filter', 'sort'],
          merge(existing, incoming) {
            return incoming
          },
        },
      },
    },
  },
})

// ─── Apollo Client ────────────────────────────────────────────────────────────
export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})
