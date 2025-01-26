import { createLazyFileRoute } from '@tanstack/react-router'
import Categories from '../pages/Categories'

export const Route = createLazyFileRoute('/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Categories />
}
