import React from 'react'
import Header from '../Ui/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../Ui/Footer'

const MainLayout = () => {
  
  return (
  <>
     <Header />

      <Outlet />

      <Footer />
  </>
  )
}

export default MainLayout