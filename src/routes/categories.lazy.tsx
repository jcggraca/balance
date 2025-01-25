import Categories from '@/pages/Categories'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Categories />
}
