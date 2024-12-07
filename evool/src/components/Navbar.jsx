import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const menuItems = [
  { label: "Our Mission", path: "/our-mission" },
  { label: "Our Vision", path: "/our-vision" },
  { label: "Our Project", path: "/our-project" },
  { label: "About Us", path: "/about-us" },
  { label: "Get Involved", path: "/get-involved" }
];

export default function Navbar() {
  const [bgColor, setBgColor] = useState('bg-[#def8f9]');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setBgColor('bg-[#F8F4EE]');
      } else {
        setBgColor('bg-[#def8f9]');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`w-full font-outfit sm:h-24 h-20 fixed ${bgColor} text-xl z-[100] font-medium lg:hover:bg-[#F8F4EE] flex md:justify-evenly justify-between items-center p-4 md:px-8 transition-all duration-500 ease-in-out`}
    >

      <div className="flex items-center text-center">
        <Link to="/">
          <img src="/evool_t.png" alt="" className='sm:w-28 w-24 ' />
        </Link>
      </div>


      <div className="hidden md:flex max-lg:text-sm gap-10 transition-all duration-300 ease-in-out">
        {menuItems.map((me, index) => (
          <Link to={me.path}><h1>{me.label}</h1></Link>
        ))}
      </div>


      <div
        className="md:hidden flex items-center transition-all duration-300 ease-in-out"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ?
          <>
            <img src="/close.png" alt="" className={`w-4 mr-2`} />
          </>
          :
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform duration-300 ease-in-out`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        }
      </div>

      <Link to="/contact-us" className={`hidden md:flex items-center justify-center border-[3px] border-black lg:p-2 p-1 lg:w-32 hover:bg-teal-200 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
        <button className=''>
          <h1 className="text-center max-lg:text-lg ">Contact Us</h1>
        </button>
      </Link>


      {isMenuOpen &&
        <div
          className={`md:hidden absolute z-10 top-20 left-0 w-full bg-[#def8f9] text-xl font-medium transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : ' opacity-0 overflow-hidden'}`}
        >
          <div className="flex flex-col -z-10 items-center gap-4 py-4 pb-20 pt-5">
            {menuItems.map((me, index) => (
              <>
                <Link to={me.path} onClick={() => setIsMenuOpen(false)} className="px-4 py-2">{me.label}</Link>
                <hr className='w-[40%] border-t-2 border-purple-500' />
              </>
            ))}
          </div>
        </div>
      }
    </div>
  );
}
