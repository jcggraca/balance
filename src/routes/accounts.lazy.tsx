import { createLazyFileRoute } from '@tanstack/react-router'
import Accounts from '../pages/Accounts'

export const Route = createLazyFileRoute('/accounts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Accounts />
}
