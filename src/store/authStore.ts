import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SecurityRole } from '@/constants/types'

export interface User {
  id: string
  username: string
  email: string
  roles: SecurityRole[]
  name?: string
  department?: string
}

interface AuthState {
  user: User | null
  token: string | null
  tokenType: string
  expiresIn: number | null
  loginAt: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (credentials: { usernameOrEmail: string; password: string }) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const GRAPHQL_URL = `${API_URL}/graphql`

// GraphQL login mutation (matches backend schema: login(input: LoginInput!): AuthPayload!)
const LOGIN_QUERY = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      tokenType
      expiresIn
      user {
        id
        username
        email
        roles
      }
    }
  }
`

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tokenType: 'Bearer',
      expiresIn: null,
      loginAt: null,
      isAuthenticated: false,
      isLoading: false,

      login: async ({ usernameOrEmail, password }) => {
        set({ isLoading: true })
        try {
          const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: LOGIN_QUERY,
              variables: { input: { usernameOrEmail, password } },
            }),
          })

          const json = await response.json()

          if (json.errors?.length) {
            throw new Error(json.errors[0].message ?? 'Login failed')
          }

          const payload = json.data?.login
          if (!payload?.token) throw new Error('No token in response')

          const user: User = {
            id: payload.user.id,
            username: payload.user.username,
            email: payload.user.email,
            roles: payload.user.roles ?? ['EMPLOYEE'],
          }

          set({
            user,
            token: payload.token,
            tokenType: payload.tokenType ?? 'Bearer',
            expiresIn: payload.expiresIn ?? null,
            loginAt: new Date().toISOString(),
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ user: null, token: null, expiresIn: null, loginAt: null, isAuthenticated: false })
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'arcade-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        tokenType: state.tokenType,
        loginAt: state.loginAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
