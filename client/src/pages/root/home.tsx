import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="flex flex-col h-[100%] relative items-center hide-scrollbar gap-24 bg-[url('/background2')]">
            <div className="flex flex-col pt-20 max-sm:pt-24 z-10 justify-center items-center  mx-auto gap-14 sm:w-[80%]">
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
                <p className='text-center md:text-xl font-normal max-sm:w-[90%] max-sm:mb-36'>
                    Welcome to Voolata, your go-to platform for creating versatile QR codes and links. Whether you need detailed medical cards, identity cards for plants and animals, or personalized profiles, Voolata has you covered. Our user-friendly platform ensures that all your essential information is just a scan away, promoting both convenience and sustainability.
                </p>
                <div className="border-2h-screen flex flex-col max-sm:mt-24 items-center">
                    <img src="/image.jpg" alt="" className="bg-contain bg-center sm:w-[90%] max-sm:w-[23rem] rounded-2xl" />
                </div>
            </div>

            <div id='about-us' className='bg-pink-100 max-sm:mt-56 tilted-top absolute sm:top-[700px] top-[650px] lg:top-[1000px] '>
                <div className='flex flex-col justify-between w-[85%] mx-auto mb-24 xl:mt-96 lg:mt-56 mt-80' >
                    <h1 className='text-5xl max-lg:mx-auto max-lg:pb-10 font-semibold '>
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
            <div className='mt-[800px] sm:mt-[600px] md:mt-[600px] lg:mt-[700px] flex items-center gap-10 w-[80%]'>
                <div className='flex flex-col gap-6 mt-36 max-sm:w-[95%] max-sm:mx-auto'>
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

            <div className="flex flex-col w-full bg-[#f7fafc] items-center sm:gap-10 mt-20">
                <h1 className="pt-20 lg:pt-20 max-sm:pb-20 text-center sm:p-5 md:text-6xl md:font-semibold max-sm:text-4xl font-bold">
                    OUR FEATURES
                </h1>
                <div className="mx-auto pb-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                    <div className="lg:col-span-2  lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:row-span-6 lg:col-start-2">
                            <div className="md:pt-56 md:pl-12 lg:sticky lg:top-4 lg:overflow-hidden">
                                <img src="/features.jpg" alt="" width={600} className='rounded-xl mx-auto max-sm:hidden ' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-7 md:pr-20 md:pt-24 p-10'>
                            {/* <h1 className='text-lg font-medium'>COLLABORATION</h1> */}
                            <h1 className='text-4xl font-semibold'>
                                Medical Cards for Humans
                            </h1>
                            <p className='text-xl'>
                                Store and access vital health information such as vaccination records, medical history, and emergency contacts. With Voolata, your essential medical details are always at your fingertips.
                            </p>
                            <div className='flex gap-5 items-center'>
                                <div className='text-5xl font-bold text-purple-700'>
                                    80%
                                </div>
                                <div>
                                    <p className='text-xl font-medium '>
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribu
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-7 md:pr-20 pt-24 p-10'>
                            {/* <h1 className='text-lg font-medium'>PROJECT MANAGEMENT</h1> */}
                            <h1 className='text-4xl font-semibold'>
                                Identity Cards for Plants and Animals
                            </h1>
                            <p className='text-xl'>
                                Create comprehensive identity cards for your pets and plants. Document species, care instructions, and other important details to ensure their well-being. This feature helps in better management and care of your beloved pets and plants.
                            </p>
                            <div className='flex gap-5 items-center'>
                                <div className='text-5xl font-bold text-purple-700'>
                                    47%
                                </div>
                                <div>
                                    <p className='text-xl font-medium '>
                                        Lorem ipsum dolor sit amet consectetur adipisicing.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-7 md:pr-20 pt-24 p-10'>
                            {/* <h1 className='text-lg font-medium'>Integrations</h1> */}
                            <h1 className='text-4xl font-semibold'>
                                Artist Cards

                            </h1>
                            <p className='text-xl'>
                                Are you an artist looking to showcase your work? Voolata allows you to create a card that includes all your social media handles and links. Convert them into a QR code and a link that you can share easily, helping you connect with your audience effortlessly.
                            </p>
                            <div className='flex gap-5 items-center'>
                                <div className='text-5xl font-bold text-purple-700'>
                                    35%
                                </div>
                                <div>
                                    <p className='text-xl font-medium '>
                                        Lorem ipsum dolor sit, amet consectetur adipisicing.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-7 md:pr-20 pt-24 p-10'>
                            {/* <h1 className='text-lg font-medium'>Slack AI</h1> */}
                            <h1 className='text-4xl font-semibold'>
                                Individual Profiles
                            </h1>
                            <p className='text-xl'>
                                Create a detailed profile that includes everything about you—your likes, dislikes, education background, professional background, marital status, diet preferences, and more. Voolata generates a QR code and a link that you can use on your social media.
                            </p>
                            <div className='flex gap-6 items-center'>
                                <div className='text-5xl  font-bold text-purple-700'>
                                    97 mins
                                </div>
                                <div>
                                    <p className='text-xl font-medium '>
                                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-[85%] mx-auto' >
                <h1 className='text-3xl md:text-6xl font-semibold pb-20 pt-16'>WHY WE NEED YOUR <span className='text-purple-500'>SUPPORT</span> </h1>
                <div className='flex max-lg:flex-col lg:gap-10'>
                    <div className='flex flex-col h-96 max-lg:pt-20 lg:pt-16 lg:shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.3)] lg:w-1/3 gap-5 lg:rounded-xl max-lg:border-b-black max-lg:border-b-[3px] border-dotted lg:border-red-400 lg:border-2 lg:p-5'>
                        <div className="flex gap-3 pl-2">
                            <img src="./research.png" alt="" className="sm:w-10 w-8" />
                            <h1 className='text-2xl font-semibold'>Research and Development</h1>
                        </div>
                        <p className='px-16'>
                            Innovation is at the heart of what we do. Your donations will help us invest in cutting-edge research and development to create new technological solutions that address everyday challenges and improve lives.
                        </p>
                    </div>
                    <div className='flex flex-col lg:pt-16 h-96 lg:shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.3)] lg:w-1/3 lg:rounded-xl lg:border-red-400 max-lg:pt-20 max-lg:border-b-black max-lg:border-b-[3px] border-dotted lg:border-[3px] gap-10 lg:p-5 '>
                        <div className="flex gap-2 pl-2 items-start">
                            <img src="./server.png" alt="" className="w-8" />
                            <h1 className='text-2xl font-semibold'>Server and Maintenance Costs</h1>
                        </div>
                        <p className="px-12">
                            To ensure our platforms run smoothly and securely, we need to cover ongoing server and maintenance expenses. Your support helps us maintain the reliability and efficiency of our services.
                        </p>
                    </div>
                    <div className='flex flex-col lg:pt-16 h-96 max-lg:pt-20 lg:shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.3)] lg:rounded-xl lg:w-1/3 lg:border-[3px] lg:border-red-400  max-lg:border-b-black max-lg:border-b-[3px] border-dotted gap-5 lg:p-5 '>
                        <div className="flex gap-2 pl-10 items-start">
                            <img src="./team.png" alt="" className="sm:w-10 w-8" />
                            <h1 className='text-2xl font-semibold'>Team Support</h1>
                        </div>
                        <p className="px-12">
                            Our dedicated team of professionals works tirelessly to develop and manage our platforms. Your contributions help us attract and retain top talent, ensuring that we continue to deliver high-quality solutions.
                        </p>
                    </div>
                </div>
                <h1 className='text-2xl md:text-4xl pb-20 pt-16 font-medium'>HOW YOUR DONATIONS MAKE A DIFFERENCE</h1>
                <div className='flex gap-6 max-lg:flex-col lg:text-sm'>
                    <div className='relative flex flex-col lg:w-1/3  '>
                        <img src="./no-1.svg" alt="" className='w-20 left-5 absolute z-10 ' />
                        <div className='mt-8 flex flex-col gap-5 pt-16 p-10 rounded-[30px] h-72 bg-[#f1bfdb] shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.2)]'>
                            <h1 className='text-lg font-bold'>Empowering Communities</h1>
                            <p>
                                By supporting our projects, you help us create user-friendly platforms that make life easier and more efficient for individuals and businesses
                            </p>
                        </div>
                    </div>
                    <div className='relative flex flex-col lg:w-1/3 '>
                        <img src="./no-2.svg" alt="" className='w-20 left-5 absolute z-10' />
                        <div className=' mt-8  flex flex-col gap-5 pt-16  p-10 rounded-[30px] h-72 bg-[#f1bfdb] shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.2)] '>
                            <h1 className='text-lg font-bold'>Creating Job Opportunities</h1>
                            <p>
                                Your donations enable us to generate employment through the platforms we develop, fostering financial independence and long-term growth.
                            </p>
                        </div>
                    </div>
                    <div className='relative flex flex-col lg:w-1/3 '>
                        <img src="./no-3.svg" alt="" className='w-20 left-5 absolute z-10 ' />
                        <div className=' mt-8  flex flex-col gap-5 pt-16  p-10 rounded-[30px] h-72 shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.2)] bg-[#f1bfdb]'>
                            <h1 className='text-lg font-bold'>Promoting Sustainability</h1>
                            <p className='max-sm:text-sm'>
                                We design eco-friendly solutions that encourage sustainable living practices. Our initiatives help conserve natural resources, reduce waste, and contribute to a healthier environment overall. By promoting digital solutions, we aim to create a more sustainable future for everyone.
                            </p>
                        </div>
                    </div>
                </div>
                <p className='md:text-2xl pt-20 pb-16'>
                    Together, we can create a future where technology drives sustainable development and enhances the quality of life for all. Join us in our mission to make a positive impact on the world.
                </p>
                <h2 className='md:text-3xl pb-56'><span className="text-blue-500 font-semibold"><Link to={'/donate'}>Donate</Link></span> Now and be a part of the <span className='text-purple-500'>CHANGE!</span></h2>
            </div>
        </div>
    )
}

export default HomePage;