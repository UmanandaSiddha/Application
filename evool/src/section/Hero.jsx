import React from 'react'

export default function Hero() {
  return (
    <div className='xl:pb-24 max-sm:pt-2 max-sm:pb-20 xl:pt-10 w-[95%] mx-auto'>
      <section className="relative h-auto w-full bg-[#222831] min-h-[400px] overflow-hidden px-5 mt-10 lg:px-20">

        <div className="absolute top-0 right-0 h-[30%] w-[30%] bg-gradient-to-tr from-emerald-200 to-emerald-500 blur-[130px]">
        </div>
        <div className="absolute bottom-0 left-0 h-[30%] w-[20%] bg-gradient-to-bl from-emerald-200 to-emerald-500 blur-[130px]">
        </div>
        <div className="p-5  grid grid-cols-1 lg:grid-cols-2 gap-10 lg:px-5 lg:py-10">
          <div>
            <h1 className="text-6xl lg:text-4xl pt-16 font-bold text-white ">We are <span className="text-pink-500">always</span> there</h1>
            <h1 className="text-3xl lg:text-4xl  font-bold text-white mt-4 ">for your need</h1>
          </div>
          <div>
            <p className=" text-gray-300 sm:text-sm ">We are a remote design agency based in Montreal working with clients around the world. As passionate designers we love building products that are easy to use accessible engaging and delightful.</p>
            <button className=" text-pink-500 mt-4 uppercase ">Contact us</button>
          </div>
        </div>
      </section>
      <img src="https://utfs.io/f/df007e37-3b42-4ada-a272-8d5e63807d6b-k6t0zq.jpg" alt="" className="sm:w-[80%] sm:h-auto w-[95%] mx-auto sm:-translate-y-32 -translate-y-10 hidden sm:block" />
      {/* <img src="/hero_pic.jpg" alt="" className="w-[70%] sm:h-auto  mx-auto sm:-translate-y-32 -translate-y-32 sm:hidden" /> */}

    </div>
  )
}
