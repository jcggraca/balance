import { createLazyFileRoute } from '@tanstack/react-router'
import Dashboard from '../pages/Dashboard'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <Dashboard />
  )
}
