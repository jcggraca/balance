import { createLazyFileRoute } from '@tanstack/react-router'
import Expenses from '../pages/Expenses'

export const Route = createLazyFileRoute('/expenses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Expenses />
}
