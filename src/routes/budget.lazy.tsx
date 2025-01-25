import Budget from '@/pages/Budget'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/budget')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Budget />
}
