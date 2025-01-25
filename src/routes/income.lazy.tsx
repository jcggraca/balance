import Income from '@/pages/Income'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/income')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Income />
}
