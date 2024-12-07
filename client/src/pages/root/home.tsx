import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const HomePage = () => {

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/about-us") {
            const aboutUsSection = document.getElementById("about-us");
            if (aboutUsSection) {
                aboutUsSection.scrollIntoView({ behavior: "smooth" });
            }
        }

    }, [location]);

    return (
        <div className="flex flex-col relative items-center hide-scrollbar ">
            <div className="bg-gradient-to-br from-[#efe8fa] to-[#fcfafd] w-full h-[150vh] absolute z-[-10]"></div>
            <div className="flex flex-col sm:pt-20 pt-10 z-10 justify-center items-center mx-auto gap-14 sm:w-[80%]">
                <h1 className="text-5xl md:text-7xl font-semibold text-center">
                    Where <span className="text-purple-900">Work</span> Happens
                </h1>
                <div className='flex items-center gap-4'>
                    <button className="uppercase bg-purple-800 text-sm sm:text-lg text-white sm:h-16 md:w-48 w-28 h-14 font-semibold rounded-lg">
                        <Link to={'/dashboard'}>Get Started</Link>
                    </button>
                    <button className='uppercase bg-white border-2 text-sm sm:text-lg border-purple-800 text-purple-800 sm:h-16 md:w-48 w-28 h-14 font-semibold rounded-lg'>
                        <Link to={'/donation'}>donate</Link>
                    </button>
                </div>
                <p className='text-center md:text-xl font-normal max-sm:w-[90%] '>
                    Welcome to Voolata, your go-to platform for creating versatile QR codes and links. Whether you need detailed medical cards, identity cards for plants and animals, or personalized profiles, Voolata has you covered. Our user-friendly platform ensures that all your essential information is just a scan away, promoting both convenience and sustainability.
                    <Link to='/about-us' className="text-md font-semibold leading-6">
                        <img src="/arrow_down.svg" alt="" className="w-48 mx-auto sm:hidden" />
                    </Link>
                </p>
                <div className="border-2h-screen flex flex-col max-sm:mt-24 items-center">
                    <img src="/image.jpg" alt="" className="bg-contain bg-center sm:w-[90%] w-[23rem] rounded-2xl " />
                </div>
            </div>

            <div id='about-us' className='bg-pink-100 tilted-top tilted-top-sm pb-10 sm:pb-20 -translate-y-32 '>
                <div className='flex flex-col justify-between w-[85%] mx-auto mt-48 sm:mt-56 xl:mt-96 ' >
                    <h1 className=' text-4xl sm:text-5xl max-lg:mx-auto pb-16 lg:pb-0 font-semibold '>
                        ABOUT US
                    </h1>
                    <div className='flex items-center gap-10 sm:gap-20 max-lg:flex-col '>
                        <img src="about_us_final.png" alt="" className='w-96 lg:hidden' />
                        <p className='md:text-xl text-lg max-sm:p-5 text-justify pt-10 lg:w-[55%]'>
                            Voolata is an innovative initiative by Evool Foundation, designed to simplify your life and contribute to environmental sustainability. Our platform allows you to generate QR codes and links for various purposes, reducing the need for paper and promoting eco-friendly practices. With Voolata, managing and sharing information has never been easier.
                        </p>
                        <img src="about_us_final.png" alt="" className='lg:w-[500px] sm:w-72 w-36 max-lg:hidden' />
                    </div>
                </div>
            </div>

            <div className=' flex items-center gap-10 w-[80%] sm:pt-16 pb-24'>
                <div className='flex flex-col gap-6  max-sm:w-[95%] max-sm:mx-auto'>
                    <h1 className='sm:text-5xl max-sm:text-4xl max-sm:text-center max-lg:mx-auto font-semibold mb-10'>HOW IT WORKS</h1>
                    <img src="./project_final.png " alt="" className='w-96 lg:hidden mx-auto' />

                    <p className='text-xl'>
                        <span className='font-medium'>Create Your Card:</span> Choose the type of card you need—medical, plant/animal identity, artist, or individual profile.
                    </p>
                    <p className='text-xl'>
                        <span className='font-medium'>Enter Details:</span> Fill in the necessary information.
                    </p>
                    <p className='text-xl'>
                        <span className='font-medium'>Generate QR Code and Link:</span>  Voolata will create both a QR code and a link for you.
                    </p>
                    <p className='text-xl'>
                        <span className='font-medium'>Download:</span> Save your QR code and link to your device.
                    </p>
                    <p className='text-xl'>
                        <span className='font-medium'>Share and Use:</span>  Print your QR code as a card or sticker, or use the link on your social media handles.
                    </p>
                </div>
                <img src="./project_final.png " alt="" className='w-96 max-lg:hidden' />
            </div>

            <div className="flex flex-col w-full bg-[#f7fafc] sm:gap-10 sm:mt-20">
                <div className="mx-auto pb-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                    <div className="lg:col-span-2  lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:row-span-6 lg:col-start-2">
                            <div className="md:pt-56 md:pl-12 lg:sticky lg:top-4 lg:overflow-hidden">
                                <img src="/features.jpg" alt="" width={600} className='rounded-xl mx-auto max-lg:hidden ' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-7 md:pr-20 md:pt-24 p-10'>
                            <h1 className="sm:pb-24 max-sm:pb-10 max-lg:text-center  text-6xl sm:font-semibold max-sm:text-4xl font-semibold ">
                                OUR FEATURES
                            </h1>
                            <img src="/features.jpg" alt="" width={600} className='lg:hidden pb-10 rounded-xl mx-auto ' />

                            <h1 className='sm:text-4xl text-3xl max-sm:text-center text-pink-400 font-semibold'>
                                Medical Cards for Humans
                            </h1>
                            <p className='sm:text-xl text-lg text-justify'>
                                Store and access vital health information such as vaccination records, medical history, and emergency contacts. With Voolata, your essential medical details are always at your fingertips.
                            </p>
                            {/* <div className='flex gap-5 items-center'>
                                <div className='text-5xl font-bold text-purple-700'>
                                    80%
                                </div>
                                <div>
                                    <p className='text-xl font-medium '>
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribu
                                    </p>
                                </div>
                            </div> */}
                        </div>
                        <div className='flex flex-col gap-7 md:pr-20 sm:pt-24 p-10'>
                            <h1 className='sm:text-4xl max-sm:text-center text-3xl text-green-600 font-semibold'>
                                Identity Cards for Plants and Animals
                            </h1>
                            <p className='sm:text-xl text-lg text-justify'>
                                Create comprehensive identity cards for your pets and plants. Document species, care instructions, and other important details to ensure their well-being. This feature helps in better management and care of your beloved pets and plants.
                            </p>
                            {/* <div className='flex gap-5 items-center'>
                                <div className='text-5xl font-bold text-purple-700'>
                                    47%
                                </div>
                                <div>
                                    <p className='text-xl font-medium '>
                                        Lorem ipsum dolor sit amet consectetur adipisicing.
                                    </p>
                                </div>
                            </div> */}
                        </div>
                        <div className='flex flex-col gap-7 md:pr-20 sm:pt-24  p-10'>
                            <h1 className='sm:text-4xl text-3xl max-sm:text-center text-cyan-600 font-semibold'>
                                Artist Cards
                            </h1>
                            <p className='sm:text-xl text-lg text-justify'>
                                Are you an artist looking to showcase your work? Voolata allows you to create a card that includes all your social media handles and links. Convert them into a QR code and a link that you can share easily, helping you connect with your audience effortlessly.
                            </p>
                            {/* <div className='flex gap-5 items-center'>
                                <div className='text-5xl font-bold text-purple-700'>
                                    35%
                                </div>
                                <div>
                                    <p className='text-xl font-medium '>
                                        Lorem ipsum dolor sit, amet consectetur adipisicing.
                                    </p>
                                </div>
                            </div> */}
                        </div>
                        <div className='flex flex-col gap-7 md:pr-20 sm:pt-24 p-10'>
                            <h1 className='sm:text-4xl max-sm:text-center text-3xl text-rose-600 font-semibold'>
                                Individual Profiles
                            </h1>
                            <p className='sm:text-xl text-lg text-justify'>
                                Create a detailed profile that includes everything about you—your likes, dislikes, education background, professional background, marital status, diet preferences, and more. Voolata generates a QR code and a link that you can use on your social media.
                            </p>
                            {/* <div className='flex gap-6 items-center'>
                                <div className='text-5xl  font-bold text-purple-700'>
                                    97 mins
                                </div>
                                <div>
                                    <p className='text-xl font-medium '>
                                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                                    </p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-[90%] sm:pt-10 sm:pb-20">
                <p className='md:text-2xl pt-20 pb-16 text-lg text-justify sm:text-center'>
                    Together, we can create a future where technology drives sustainable development and enhances the quality of life for all. Join us in our mission to make a positive impact on the world.
                </p>
                <Link to="/donation" target='blank'>
                    <button className="px-6 max-sm:w-[96%] py-3 font-bold sm:h-28 h-24 mt-10 rounded-3xl flex flex-col shadow-[-7px_2px_15px_0px_rgba(0,_0,_0,_0.1)] items-center justify-center sm:w-[70%] mx-auto active:shadow-none hover:translate-y-1 active:translate-y-2 transition-all duration-150">
                        <h2 className='md:text-4xl text-center text-xl font-semibold'>Donate now and be a part of the <span className='text-purple-500 max-sm:text-2xl'>CHANGE!!</span></h2>
                    </button>
                </Link>
            </div>
            
        </div>
    )
}

export default HomePage;