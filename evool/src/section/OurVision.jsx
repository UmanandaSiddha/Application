import React from 'react'

export default function OurVision() {
  return (
    <div className='bg-gray-100 mb-20' id='our-vision'>
      <div className='sm:pb-36 pb-10 w-[85%] mx-auto pt-20' id='vision'>
        <h1 className='text-4xl sm:text-6xl pb-10 max-sm:text-center font-semibold'>OUR VISION</h1>
        <div className='flex flex-col lg:flex-row items-center gap-14'>
          <img src="vision_bg.png" alt="" className='w-full md:w-[500px] rounded-lg' />
          <p className='text-lg md:text-2xl lg:w-[60%] text-justify mt-8 md:mt-0'>
            We envision a world where technology is a catalyst for sustainable development, enhancing the quality of life for all. Our goal is to lead the way in using innovative technological solutions to create a fairer, more sustainable future. We aim to ensure that technology bridges gaps, empowers communities, and leaves no one behind. By fostering a culture of continuous improvement and collaboration, we strive to make a lasting positive impact on society and the environment.
          </p>
        </div>
      </div>
    </div>

  )
}
