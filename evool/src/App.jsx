import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './home'
import ScrollToSection from './components/ScrollToSection'
import ContactUs from './section/ContactUs'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <BrowserRouter>
      <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
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
