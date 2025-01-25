import Layout from '@/layout/Layout'
import { createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Layout />
      <TanStackRouterDevtools />
    </>
  ),
})
