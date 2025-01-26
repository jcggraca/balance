import { createLazyFileRoute } from '@tanstack/react-router'
import Budget from '../pages/Budget'

export const Route = createLazyFileRoute('/budget')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Budget />
}
