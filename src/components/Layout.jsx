import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'
import CustomCursor from './CustomCursor'
import useScrollReveal from '../hooks/useScrollReveal'
import './Layout.css'

export default function Layout() {
  const { pathname } = useLocation()
  useScrollReveal()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="site-wrapper">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
