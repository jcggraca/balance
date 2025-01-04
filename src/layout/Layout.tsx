import type { FC } from 'react'
import Navbar from '@/components/NavBar/NavBar'
import { Outlet } from 'react-router-dom'
import classes from './Layout.module.css'

const Layout: FC = () => {
  return (
    <div className={classes.layout}>
      <Navbar />

      <main className={classes.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
