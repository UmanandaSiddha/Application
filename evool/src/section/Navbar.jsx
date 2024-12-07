import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [bgColor, setBgColor] = useState('bg-[#def8f9]');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility

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
      className={`w-full font-outfit h-24 fixed ${bgColor} text-xl z-[100] font-medium hover:bg-[#F8F4EE] flex justify-between items-center p-4 md:px-8 transition-all duration-300 ease-in-out`}
    >
    
      <div className="flex items-center text-center">
        <a href="/">
          <h1 className="text-center">Evool</h1>
        </a>
      </div>

      
      <div className="hidden md:flex gap-10 transition-all duration-300 ease-in-out">
        <a href="#mission"><h1>Our Mission</h1></a>
        <a href="#vision"><h1>Our Vision</h1></a>
        <a href="#project"><h1>Our Project</h1></a>
        <a href="#about-us"><h1>About Us</h1></a>
        <a href="#involved"><h1>Get Involved</h1></a>
      </div>

      
      <div
        className="md:hidden flex items-center transition-all duration-300 ease-in-out"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-45' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>

      
      <div
        className={`hidden md:flex items-center border-[3px] border-black p-2 w-32 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
      >
        <a href="/">
          <h1 className="text-center">Evool</h1>
        </a>
      </div>


      <div
        className={`md:hidden absolute top-24 left-0 w-full bg-[#def8f9] text-xl font-medium transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <a href="#mission" className="px-4 py-2">Our Mission</a>
          <a href="#vision" className="px-4 py-2">Our Vision</a>
          <a href="#project" className="px-4 py-2">Our Project</a>
          <a href="#about-us" className="px-4 py-2">About Us</a>
          <a href="#involved" className="px-4 py-2">Get Involved</a>
        </div>
      </div>
    </div>
  );
}
