import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './home'
import ScrollToSection from './components/ScrollToSection'
import ContactUs from './section/ContactUs'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToSection />
        <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/our-mission' element={<HomePage />} />
          <Route path='/our-vision' element={<HomePage />} />
          <Route path='/our-project' element={<HomePage />} />
          <Route path='/about-us' element={<HomePage />} />
          <Route path='/get-involved' element={<HomePage />} />
          <Route path='/contact-us' element={<ContactUs />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
