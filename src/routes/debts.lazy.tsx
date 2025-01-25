import Debts from '@/pages/Debts'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/debts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Debts />
}
