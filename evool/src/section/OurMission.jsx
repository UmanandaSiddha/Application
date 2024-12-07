import React from 'react'

export default function OurMission() {
  return (
    // <div className=' pb-48 pt-20 flex flex-col w-[85%] mx-auto' id='mission'>
    //   <h1 className='text-3xl md:text-6xl pb-10 font-semibold'>OUR MISSION</h1>
    //   <div className='flex items-center gap-10'>
    //     <p className='text-lg md:text-2xl w-[60%] text-justify'>
    //       Our mission is to simplify lives, generate employment, and foster environmental sustainability through innovative technological solutions. We strive to meet the needs of our community and the environment, ensuring that technology acts as a force for positive change and sustainable development.
    //     </p>
    //     <img src="our_mission_hd.png" alt=""  className='rounded-2xl w-[700px]' />
    //   </div>
    // </div>
    <div className='pb-32  max-sm:pb-20 lg:pt-0 sm:pt-[500px] pt-[500px] max-xl:text-center flex flex-col w-[85%] mx-auto' id='our-mission'>
      <h1 className='text-4xl md:text-6xl max-sm:text-center pb-10 font-semibold'>OUR MISSION</h1>
      <div className='flex flex-col lg:flex-row items-center gap-10'>
        <p className='text-lg md:text-2xl w-full md:w-[60%] text-justify'>
          Our mission is to simplify lives, generate employment, and foster environmental sustainability through innovative technological solutions. We strive to meet the needs of our community and the environment, ensuring that technology acts as a force for positive change and sustainable development.
        </p>
        <img src="our_mission_hd.png" alt="" className='rounded-2xl w-[700px]' />
      </div>
    </div>

  )
}
