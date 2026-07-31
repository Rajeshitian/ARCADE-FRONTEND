# ARCADE — Enterprise Frontend

A production-ready, enterprise-grade React frontend for the ARCADE AI code review and HR management platform.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v3 |
| Components | Radix UI primitives |
| Animation | Framer Motion |
| State | Zustand |
| Server State | TanStack Query |
| GraphQL | Apollo Client |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Demo Credentials

```
Email:    admin@arcade.ai
Password: demo1234
```

The app runs in **demo mode** when the Spring Boot backend is not available. All data is mocked locally.

## Backend Connection

Point to your Spring Boot GraphQL backend by updating `src/services/apollo.ts`:

```typescript
const GRAPHQL_URL = 'http://localhost:8080/graphql'
const WS_URL = 'ws://localhost:8080/graphql'
```

## Project Structure

```
src/
├── app/              # AppRoutes, providers
├── animations/       # Framer Motion variants
├── components/
│   ├── ui/           # Base components (Button, Input, Card, etc.)
│   ├── layout/       # Sidebar, Header
│   ├── charts/       # StatCard and chart wrappers
│   └── common/       # CommandPalette, etc.
├── constants/        # Types, mockData, enums
├── graphql/
│   ├── queries/
│   ├── mutations/
│   └── subscriptions/
├── hooks/            # Apollo + custom hooks
├── layouts/          # AppLayout
├── modules/          # Feature business logic (schemas, etc.)
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Employees/
│   ├── Analytics/
│   ├── Settings/
│   └── NotFound/
├── routes/           # ProtectedRoute
├── services/         # Apollo client config
├── store/            # Zustand stores (auth, ui)
└── utils/            # Helpers, formatters
```

## Features

- ✅ Premium Login Page with animated background
- ✅ Dashboard with animated stat cards, charts, activity feed
- ✅ Employee Management (CRUD, sort, filter, paginate, search)
- ✅ Analytics page with Recharts visualizations
- ✅ Settings page
- ✅ Animated sidebar (collapsible)
- ✅ Command Palette (⌘K)
- ✅ Toast notification system
- ✅ Dark/Light mode
- ✅ JWT authentication with Zustand persistence
- ✅ Apollo Client with WebSocket subscriptions
- ✅ Code splitting + lazy loading
- ✅ Protected routes + role-based access
- ✅ Form validation with Zod
- ✅ Framer Motion page transitions
- ✅ Glassmorphism design system
- ✅ Responsive design

## GraphQL Operations

All queries, mutations and subscriptions are in `src/graphql/`. The Apollo client is configured with:
- JWT token injection via `setContext`
- Error handling + auto token refresh via `onError`
- Retry logic via `RetryLink`
- WebSocket subscriptions via `graphql-ws`
- Optimistic updates on mutations
- Intelligent cache policies
