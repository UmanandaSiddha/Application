import React from 'react'

export default function NeedSupport() {
  return (
    <div className='w-[85%] mx-auto' >
      <h1 className='text-4xl sm:text-6xl max-lg:text-center font-semibold sm:pb-20 sm:pt-16'>WHY WE NEED YOUR SUPPORT </h1>

      <div class="flex items-center justify-center mt-12">
        <div class="grid grid-cols-1 gap-10 sm:grid-cols-1 lg:grid-cols-3">

          <div class="relative bg-white py-6 px-6 rounded-3xl sm:w-[25rem] sm:h-96 h-[26rem]  my-4 shadow-[-8px_7px_48px_-2px_rgba(0,_0,_0,_0.1)]">
            <div class=" text-white flex items-center text-center justify-center absolute rounded-full w-16 h-16 shadow-2xl bg-pink-500 left-10 top-5">
              <img src="/research.png" alt="" className='w-10' />
            </div>
            <div class="mt-9 p-5 ">
              <p class="text-xl font-semibold my-2 max-sm:text-center">Research and Development</p>
              <div class="flex space-x-2 pb-5 pt-3 text-gray-500 text-lg max-sm:tex">
                <p className='h-44'>Innovation is at the heart of what we do. Your donations will help us invest in cutting-edge research and development to create new technological solutions that address everyday challenges and improve lives.</p>
              </div>

              <div class="border-t-2 hidden sm:block"></div>
            </div>
          </div>

          <div class="relative bg-white py-6 px-6 rounded-3xl sm:w-[25rem] sm:h-96 h-[26rem] my-4 shadow-[-8px_7px_48px_-2px_rgba(0,_0,_0,_0.1)]">
            <div class=" text-white flex items-center justify-center absolute rounded-full w-16 h-16 shadow-2xl bg-pink-500 left-10 top-5">
              <img src="/server.png" alt="" className='w-10' />
            </div>
            <div class="mt-9 p-5 ">
              <p class="text-xl font-semibold my-2">Server and Maintenance Costs</p>
              <div class="flex space-x-2 pb-5 pt-3 text-gray-500 text-lg">
                <p className='h-44 '>To ensure our platforms run smoothly and securely, we need to cover ongoing server and maintenance expenses. Your support helps us maintain the reliability and efficiency of our services.</p>
              </div>

              <div class="border-t-2 hidden sm:block"></div>
            </div>
          </div>

          <div class="relative bg-white py-6 px-6 rounded-3xl sm:w-[25rem] sm:h-96 h-[26rem] my-4 shadow-[-8px_7px_48px_-2px_rgba(0,_0,_0,_0.1)]">
            <div class=" text-white flex items-center justify-center absolute rounded-full w-16 h-16 shadow-2xl bg-pink-500 left-10 top-5">
              <img src="/team.png" alt="" className='w-10' />
            </div>
            <div class="mt-10 p-5 ">
              <p class="text-xl font-semibold my-2">Team Support</p>
              <div class="flex space-x-2 pb-5 pt-3 text-gray-500 text-lg">
                <p className='h-44 '>Our dedicated team of professionals works tirelessly to develop and manage our platforms. Your contributions help us attract and retain top talent, ensuring that we continue to deliver high-quality solutions.</p>
              </div>

              <div class="border-t-2 hidden sm:block"></div>
            </div>
          </div>

        </div>
      </div>
      <h1 className='text-2xl md:text-4xl sm:pb-20 pb-5 pt-16 font-semibold max-sm:text-center'>HOW YOUR DONATIONS MAKE A DIFFERENCE</h1>
      <div className='flex flex-col lg:flex-row gap-6 lg:text-sm max-sm:flex-col'>
        <div className='flex flex-col w-full lg:w-1/3 mt-8 gap-5 items-center rounded-xl h-[27rem] shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.1)]'>
          <div className='w-full h-24 bg-[#b1fadd] rounded-t-xl flex flex-col items-center justify-center'>
            <h1 className='sm:text-[1.7rem] text-2xl font-bold text-center'>Empowering Communities</h1>
          </div>
          <div className='w-[80%]'>
            <p className='sm:text-lg pb-10 font-medium h-60 text-center'>
              By supporting our projects, you help us create user-friendly platforms that make life easier and more efficient for individuals and businesses.
            </p>
            <hr className='border-t-4 border-blue-700 w-[75%] rounded-3xl mx-auto' />
          </div>
        </div>

        <div className='flex flex-col w-full lg:w-1/3 mt-8 gap-5 items-center rounded-xl h-[27rem] shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.1)]'>
          <div className='w-full h-24 bg-[#bfd9ff] rounded-t-xl flex flex-col items-center justify-center'>
            <h1 className='sm:text-[1.7rem] text-2xl font-bold text-center'>Creating Job Opportunities</h1>
          </div>
          <div className='w-[80%]'>
            <p className='sm:text-lg pb-10 font-medium h-60 text-center'>
              Your donations enable us to generate employment through the platforms we develop, fostering financial independence and long-term growth.
            </p>
            <hr className='border-t-4 border-blue-700 w-[75%] rounded-3xl mx-auto' />
          </div>
        </div>

        <div className='flex flex-col w-full lg:w-1/3 mt-8 gap-5 items-center rounded-xl h-[27rem] shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.1)]'>
          <div className='w-full h-24 bg-[#e3bfff] rounded-t-xl flex flex-col items-center justify-center'>
            <h1 className='text-2xl sm:text-[1.7rem] font-bold text-center'>Promoting Sustainability</h1>
          </div>
          <div className='w-[80%]'>
            <p className='sm:text-lg pb-10 font-medium h-60 text-center'>
              We design eco-friendly solutions that encourage sustainable living practices. Our initiatives help conserve natural resources, reduce waste, and contribute to a healthier environment overall. By promoting digital solutions, we aim to create a more sustainable future for everyone.
            </p>
            <hr className='border-t-4 border-blue-700 w-[75%] rounded-3xl mx-auto' />
          </div>
        </div>
      </div>

      <p className='md:text-2xl pt-20 pb-16'>
        Together, we can create a future where technology drives sustainable development and enhances the quality of life for all. Join us in our mission to make a positive impact on the world.
      </p>
      <a href="https://voolata.com/donation" target='blank'>
        <button class="px-6 py-3 font-bold sm:h-28 h-24 mt-10 rounded-3xl flex flex-col shadow-[-7px_2px_15px_0px_rgba(0,_0,_0,_0.1)] items-center justify-center sm:w-[70%] mx-auto active:shadow-none hover:translate-y-1 active:translate-y-2 transition-all duration-150">
          <h2 className='md:text-4xl text-center font-semibold'>Donate Now and be a part of the <span className='text-purple-500 '>CHANGE!</span></h2>
        </button>
      </a>
    </div>
  )
}

