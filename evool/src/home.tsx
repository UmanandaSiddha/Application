import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import AboutUs from './section/AboutUs'
import WhatWeDo from './section/WhatWeDo'
import OurMission from './section/OurMission'
import OurVision from './section/OurVision'
import OurProjects from './section/OurProjects'
import GetInvolved from './section/GetInvolved'
import NeedSupport from './section/NeedSupport'
import Hero from './section/Hero'
import Footer from './components/Footer'
import SideBar from './components/SideBar'

function HomePage() {
    return (
        <div className='mx-auto overflow-hidden'>
            <SideBar />
            <Navbar />
            <div className=' relative flex flex-col mx-auto mt-20 sm:mt-24'>
                <div className='bg-gradient-to-b from-[#787cfe] to-[#48bed9]'>
                    <Hero />
                    <AboutUs />
                </div>
                <WhatWeDo />
                <OurMission />
                <OurVision />
                <OurProjects />
                <GetInvolved />
                <NeedSupport />
            </div>
            <Footer />
        </div>
    )
}

export default HomePage;