import React from 'react'

export default function WhatWeDo() {
  return (
    <div className='h-[1000px] relative pt-0'>
      <div className=' bg-gradient-to-b mt-0 -translate-y-[1px] from-[#48bed9] to-[#ffffff] tilted-bottom-part h-[550px]'></div>
      <div className='flex-col  flex items-center'>
        <div className='md:pt-64  md:pb-20 w-[85%] mx-auto absolute -top-20 z-20 pt-36'>
          <h1 className='text-4xl sm:text-6xl  max-sm:text-center pb-16 font-semibold'>What We Do</h1>
          <div className='flex flex-col lg:flex-row justify-center mx-auto gap-5'>
            <div className='flex flex-col  w-full xl:w-1/3 pt-20 p-12 border-[4px] rounded-xl shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.3)] border-red-500 border-dotted bg-white'>
              <h1 className='sm:text-3xl text-2xl font-bold pb-8 max-sm:text-center'>Develop User Friendly Platforms</h1>
              <p className='sm:text-xl text-sm pb-10 max-sm:text-center'>We create intuitive platforms that address everyday challenges, making life easier and more efficient. Our solutions are designed to offer practical benefits and improve daily routines.</p>
            </div>
            <div className='flex flex-col w-full xl:w-1/3 pt-20 p-12 border-[4px] rounded-xl shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.3)] border-red-500 border-dotted bg-white'>
              <h1 className='sm:text-3xl text-2xl font-bold pb-8 max-md:text-nowrap max-sm:text-center'>Create Job <br className='md:hidden' /> Opportunities</h1>
              <p className='sm:text-xl text-sm pb-10 max-sm:text-center'>A core objective is to generate employment through the platforms we develop. By providing tools that help individuals and businesses operate more efficiently, we open doors to financial independence and long-term growth.</p>
            </div>
            <div className='flex flex-col w-full xl:w-1/3 pt-20 p-12 border-[4px] rounded-xl shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.3)] border-red-500 border-dotted bg-white'>
              <h1 className='sm:text-3xl text-2xl font-bold pb-8  max-sm:text-center '>Promote Environmental <br /> Sustainability</h1>
              <p className='sm:text-xl text-sm pb-10 max-sm:text-center'>We design eco-friendly solutions that encourage sustainable living practices, contributing to environmental conservation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
