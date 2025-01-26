import { createRootRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import Layout from '../layout/Layout'
import ErrorNotFound from '../pages/ErrorNotFound'

const TanStackRouterDevtools = import.meta.env.VITE_ENV === 'production'
  ? () => null
  : lazy(() =>
      import('@tanstack/router-devtools').then(res => ({
        default: res.TanStackRouterDevtools,
      })),
    )

export const Route = createRootRoute({
  component: () => (
    <>
      <Layout />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
  notFoundComponent: () => <ErrorNotFound />,
})
