import React from 'react'
import { useState } from 'react'
export default function SideBar() {
  const [side, setSide] = useState(false)
  return (
    <div className='z-50 w-14 max-sm:w-12 h-full fixed right-0 mx-auto flex flex-col items-center justify-center '>
      <div className=''>
        {side ? (
          <div
            className="-rotate-90 w-64 h-[500px] max-sm:w-40  transition-all duration-700 ease-in-out transform flex flex-col justify-center items-center bg-teal-300 opacity-90"
          >
            <button onClick={() => setSide(false)}>
              <img src="top-arrow.svg" alt="" className="w-5 rotate-180 transition-transform duration-700"
              />
            </button>
            {side && (
              <div
                className="w-48 h-[440px]  overflow-hidden opacity-100 transition-opacity duration-1000 ease-in-out"
              >
                <p className="rotate-90 mt-14 -ml-3 w-52">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Accusamus, perspiciatis.
                  <a href="https://voolata.com" target="_blank" rel="noopener noreferrer">
                    <h1 className="pt-5 font-outfit text-xl text-red-500">
                      Take Me There
                    </h1>
                  </a>
                </p>
              </div>
            )}
          </div>
        )
          : (
            <div className='-rotate-90 w-64 max-sm:w-40 h-14 max-sm:h-12 transition-all duration-700 ease-in-out transform  flex justify-center items-center bg-teal-300 opacity-90'>
                <button onClick={() => setSide(true)}>
                <div className='flex gap-2 justify-center items-center'>
                  <h1 className='text-red-500 font-semibold sm:font-extrabold text-lg sm:text-xl'>DONATE</h1>
                  <img src="top-arrow.svg" alt="" className='w-5 transition-transform duration-700' />
                </div>
            </button>
              </div>

          )}
      </div>
    </div>
  )
}
