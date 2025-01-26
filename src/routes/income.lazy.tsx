import { createLazyFileRoute } from '@tanstack/react-router'
import Income from '../pages/Income'

export const Route = createLazyFileRoute('/income')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Income />
}
