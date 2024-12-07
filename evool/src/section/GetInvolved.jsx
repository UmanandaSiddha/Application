import React from 'react'

export default function GetInvolved() {
  return (
    <div className='flex flex-col gap-10 pb-36 w-[85%] mx-auto' id='get-involved'>
      <div>
        <h1 className='text-4xl sm:text-6xl max-lg:text-center font-semibold pb-10 '>GET INVOLVED</h1>
        <p className='text-lg md:text-2xl'>
          At Evool Foundation, we believe that meaningful change happens when
          people come together. We invite individuals, organizations, and
          businesses who share our vision of using technology to address
          human and environmental challenges to join us in our mission.
        </p>
        <h1 className='text-2xl md:text-4xl sm:pt-24 pt-10 max-md:font-semibold font-semibold md:pb-5 text-center w-fit mx-auto border-b-4 border-purple-400 pb-3'>WAYS TO GET INVOLVED</h1>
      </div>
      <div className='flex max-lg:flex-col gap-8 p-3 justify-center mx-auto '>
        <div className='flex flex-col lg:w-[40%] max-sm:h-80 relative gap-10 rounded-2xl shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.1)] bg-white border-dotted border-red-400 border-[4px] text-center p-10'>
          <h1 className='md:text-3xl font-semibold text-2xl'>Partner with Us</h1>
          <p className='font-medium md:text-base text-sm text-center'>Collaborate with us to develop new platforms that address critical social and environmental needs.</p>
        </div>
        <div className="flex flex-col lg:w-[40%] lg: gap-5 pb-16 max-sm:h-80 rounded-2xl shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.1)] bg-white text-center p-10 border-dotted border-red-400 border-[4px] ">
          <h1 className='md:text-3xl font-semibold text-2xl'>Volunteer Your Time and Expertise</h1>
          <p className='font-medium text-sm '>If you’re passionate about technology, sustainability, or community development, we’d love to have your support. Whether through web development, outreach, software engineering.</p>
        </div>
        <div className="flex flex-col lg:w-[40%] gap-10 rounded-2xl shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.1)] bg-white border-dotted border-red-400 border-[4px] text-center p-10 ">
          <h1 className='md:text-3xl font-semibold text-2xl'>Become a Supporter</h1>
          <p className='font-medium md:text-base text-sm'>Whether through financial contributions or spreading the word, your support helps us continue developing platforms that improve lives and care for the planet.</p>
        </div>
      </div>
      <h2 className='text-2xl max-md:font-semibold
       md:text-4xl sm:pt-20 max-sm:text-center w-fit mx-auto border-b-4 pb-4 border-purple-400'>
        SUPPORT EVOOL FOUNDATION
      </h2>
      <p className='text-lg md:text-2xl'>
        At Evool Foundation, we are dedicated to harnessing the power of technology for social good. Your support can help us continue our mission to simplify lives, generate employment, and promote environmental sustainability. By donating to Evool Foundation, you are contributing to a brighter, more sustainable future for all.
      </p>
    </div>
  )
}
