import React from 'react'

export default function OurProjects() {
  return (
    
    <div className='pb-36 max-sm:pb-20 w-[85%] mx-auto sm:pt-20' id='our-project'>
      <h1 className='text-4xl text-nowrap max-lg:text-center font-semibold  md:text-6xl pb-10'>OUR PROJECTS</h1>
      <div className='flex flex-col lg:flex-row gap-10 md:gap-20 items-center'>
        <img src="qrcode.jpg" alt="" className='w-full sm:hidden md:w-[500px] rounded-lg pt-10' />
        <p className='text-lg xl:text-2xl w-full md:w-[60%] text-justify mb-8 md:mb-0'>
          Voolata is an innovative QR code generator web platform designed to create detailed medical cards for humans, as well as identity cards for plants and animals. This platform allows users to store and access vital health information for themselves and comprehensive details for their pets and plants, ensuring that all essential information is always at hand.
          With Voolata, you can create medical profiles that include vaccination records, medical history, and emergency contacts for humans. Additionally, it allows you to generate identity cards for plants and animals, documenting their species, care instructions, and other important details. This holistic approach not only ensures better care and management but also promotes environmental sustainability by reducing the need for paper records and encouraging eco-friendly practices.
        </p>
        <img src="qrcode.jpg" alt="" className='w-full hidden sm:block md:w-[500px] rounded-lg' />
      </div>
    </div>

  )
}
