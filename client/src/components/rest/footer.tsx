const Footer = () => {
    return (
        <div className='flex justify-center items-center mt-16 bg-[#5f5fc2] tilted-top'>
            <div className='flex max-md:flex-col justify-center md:p-24 p-10 mx-auto w-[90%] '>
                <div className="flex   lg:w-1/2 max-lg:gap-10 ">
                    <div className='flex md:mr-16 gap-6 flex-col w-1/2 mt-36 lg:mt-56'>
                        <h2 className='text-white md:text-2xl font-medium'><span className='text-blue-300'>Evool</span> Foundation  </h2>
                        <p className='md:text-normal  text-white text-sm '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis officiis illo optio excepturi doloremque eaque. Adipisci vitae tempora consequuntur praesentium.</p>
                        <div className='flex  justify-start  gap-10'>
                            <img src="twitter.png" alt="" width={30} />
                            <img src="meta.png" alt="" width={30} />
                            <img src="ig.png" alt="" width={30} />
                        </div>
                    </div>
                    <div className='flex gap-6 flex-col w-1/2 mt-36 lg:mt-56 '>
                        <h2 className='md:text-2xl font-medium text-white'>Company</h2>
                        <ul className='outline-none text-white '>
                            <li >About Us</li>
                            <li>Our Services</li>
                            <li>Our Projects</li>
                            <li>Blog & Updates</li>
                        </ul>
                    </div>

                </div>
                <div className="flex gap-5 lg:w-1/2  max-lg:gap-10 max-lg:pb-36">
                    <div className='flex gap-6 flex-col w-1/2 lg:mt-56 mt-36'>
                        <h2 className='md:text-2xl font-medium text-white'>Links</h2>
                        <ul className='text-white'>
                            <li>F.A.Q</li>
                            <li>Testimonials</li>
                            <li>Recent Work</li>
                            <li>Features</li>
                        </ul>
                    </div>
                    <div className='flex gap-6 flex-col w-1/2 lg:mt-56 mt-36'>
                        <h2 className='md:text-2xl font-medium text-white'>Contact</h2>
                        <ul className='text-white'>
                            <li>+123 456 7890</li>
                            <li>info@marketing.com</li>
                            <li>123 Main St. Suite 100, Anytown,<br />Any State USA 456789
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;