import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './home'
import ScrollToSection from './components/ScrollToSection'
import ContactUs from './section/ContactUs'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';

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
        <Navbar />
        <Routes>
          <Route path='/' element={
            <>
              <Helmet>
                <title>Evool Foundation | Home</title>
                <meta name="description" content={`This is the home page of Evool Foundation`} />
                <meta name="keywords" content="home, Evool Foundation" />
              </Helmet>
              <HomePage />
            </>
          } />
          <Route path='/our-mission' element={
            <>
              <Helmet>
                <title>Evool Foundation | Our Mission</title>
                <meta name="description" content={`This is the our mission page of Evool Foundation`} />
                <meta name="keywords" content="our-mission, Evool Foundation" />
              </Helmet>
              <HomePage />
            </>
          } />
          <Route path='/our-vision' element={
            <>
              <Helmet>
                <title>Evool Foundation | Our Vision</title>
                <meta name="description" content={`This is the our vision page of Evool Foundation`} />
                <meta name="keywords" content="our-vision, Evool Foundation" />
              </Helmet>
              <HomePage />
            </>
          } />
          <Route path='/our-project' element={
            <>
              <Helmet>
                <title>Evool Foundation | Our Project</title>
                <meta name="description" content={`This is the our project page of Evool Foundation`} />
                <meta name="keywords" content="our-project, Evool Foundation" />
              </Helmet>
              <HomePage />
            </>
          } />
          <Route path='/about-us' element={
            <>
              <Helmet>
                <title>Evool Foundation | About Us</title>
                <meta name="description" content={`This is the our about us page of Evool Foundation`} />
                <meta name="keywords" content="about-us, Evool Foundation" />
              </Helmet>
              <HomePage />
            </>
          } />
          <Route path='/get-involved' element={
            <>
              <Helmet>
                <title>Evool Foundation | Get Involved</title>
                <meta name="description" content={`This is the our get involved page of Evool Foundation`} />
                <meta name="keywords" content="get-involved, Evool Foundation" />
              </Helmet>
              <HomePage />
            </>
          } />
          <Route path='/contact-us' element={
            <>
              <Helmet>
                <title>Evool Foundation | Contact Us</title>
                <meta name="description" content={`This is the our contact us page of Evool Foundation`} />
                <meta name="keywords" content="contact-us, Evool Foundation" />
              </Helmet>
              <ContactUs />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
