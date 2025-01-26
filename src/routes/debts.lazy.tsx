import { createLazyFileRoute } from '@tanstack/react-router'
import Debts from '../pages/Debts'

export const Route = createLazyFileRoute('/debts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Debts />
}
