import Expenses from '@/pages/Expenses'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/expenses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Expenses />
}
