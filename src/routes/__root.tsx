import { createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Layout from '../layout/Layout'
import ErrorNotFound from '../pages/ErrorNotFound'

export const Route = createRootRoute({
  component: () => (
    <>
      <Layout />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => <ErrorNotFound />,
})
