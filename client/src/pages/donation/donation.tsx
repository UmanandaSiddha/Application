import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Donation = () => {
    return (
        <>
            <Helmet>
                <title>Voolata | Donation</title>
                <meta name="description" content={`This is the donation page of Voolata`} />
                <meta name="keywords" content="donation, voolata" />
            </Helmet>
            <div className='w-[85%] mx-auto lg:mt-0 mt-10' >
                <h1 className='text-3xl text-center md:text-6xl font-semibold lg:pb-20 lg:pt-16 sm:pt-10'>WHY WE NEED YOUR <span className='text-purple-500'>SUPPORT</span> </h1>
                <div className='flex flex-col lg:flex-row lg:gap-10'>
                    <div className='flex flex-col lg:h-96 max-lg:pt-20 lg:pt-16 lg:shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.3)] lg:w-1/3 gap-5 lg:rounded-xl max-lg:border-b-black max-lg:border-b-[3px] border-dotted lg:border-red-400 lg:border-[3px] lg:p-5'>
                        <div className="flex gap-3 justify-center items-center">
                            <img src="./research.png" alt="" className="sm:w-10 w-10 h-10" />
                            <h1 className='text-2xl font-semibold max-lg:text-center '>Research and Development</h1>
                        </div>
                        <p className=' max-lg:text-justify max-lg:pb-20 p-5 lg:-mt-3'>
                            Innovation is at the heart of what we do. Your donations will help us invest in cutting-edge research and development to create new technological solutions that address everyday challenges and improve lives.
                        </p>
                    </div>
                    <div className='flex flex-col lg:pt-16 lg:h-96 lg:shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.3)] lg:w-1/3 lg:rounded-xl lg:border-red-400 max-lg:pt-20 max-lg:border-b-black max-lg:border-b-[3px] border-dotted lg:border-[3px] gap-10 lg:p-5 '>
                        <div className="flex gap-7 justify-center items-center">
                            <img src="./server.png" alt="" className="w-8 h-8" />
                            <h1 className='text-2xl font-semibold sm:text-center md:text-left'>Server and Maintenance Costs</h1>
                        </div>
                        <p className=" max-lg:text-justify max-lg:pb-20 p-3 lg:-mt-9">
                            To ensure our platforms run smoothly and securely, we need to cover ongoing server and maintenance expenses. Your support helps us maintain the reliability and efficiency of our services.
                        </p>
                    </div>
                    <div className='flex flex-col lg:pt-16 lg:h-96 max-lg:pt-20 lg:shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.3)] lg:rounded-xl lg:w-1/3 lg:border-[3px] lg:border-red-400  max-lg:border-b-black max-lg:border-b-[3px] border-dotted gap-5 lg:p-5 '>
                        <div className="flex gap-6 sm:justify-center items-center">
                            <img src="./team.png" alt="" className="sm:w-10 w-8" />
                            <h1 className='text-2xl font-semibold max-lg:text-center'>Team Support</h1>
                        </div>
                        <p className=" max-lg:text-justify max-lg:pb-20 p-6">
                            Our dedicated team of professionals works tirelessly to develop and manage our platforms. Your contributions help us attract and retain top talent, ensuring that we continue to deliver high-quality solutions.
                        </p>
                    </div>
                </div>
                <h1 className='text-2xl md:text-4xl pb-20 pt-16 font-medium'>HOW YOUR DONATIONS MAKE A DIFFERENCE</h1>
                <div className='flex gap-6 max-lg:flex-col lg:text-sm'>
                    <div className='relative flex flex-col lg:w-1/3  '>
                        <img src="./no-1.svg" alt="" className='w-20 max-sm:w-16 left-5 absolute z-10 ' />
                        <div className='mt-8 flex flex-col gap-5 sm:pt-16 p-10 rounded-[30px] h-72 bg-[#f1bfdb] shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.2)]'>
                            <h1 className='text-lg font-bold'>Empowering Communities</h1>
                            <p>
                                By supporting our projects, you help us create user-friendly platforms that make life easier and more efficient for individuals and businesses
                            </p>
                        </div>
                    </div>
                    <div className='relative flex flex-col lg:w-1/3 '>
                        <img src="./no-2.svg" alt="" className='w-20 max-sm:w-16 left-5 absolute z-10' />
                        <div className=' mt-8  flex flex-col gap-5 sm:pt-16  p-10 rounded-[30px] h-72 bg-[#f1bfdb] shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.2)] '>
                            <h1 className='text-lg font-bold'>Creating Job Opportunities</h1>
                            <p>
                                Your donations enable us to generate employment through the platforms we develop, fostering financial independence and long-term growth.
                            </p>
                        </div>
                    </div>
                    <div className='relative flex flex-col lg:w-1/3 '>
                        <img src="./no-3.svg" alt="" className='w-20 max-sm:w-16 left-5 absolute z-10 ' />
                        <div className=' mt-8  flex flex-col gap-5 sm:pt-16  p-10 rounded-[30px] h-72 shadow-[-3px_12px_46px_-2px_rgba(0,_0,_0,_0.2)] bg-[#f1bfdb]'>
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
                <h2 className='md:text-3xl pb-16'><span className="text-purple-700 font-semibold"><Link to="/donation/dashboard">Donate</Link></span> Now and be a part of the <span className='text-purple-500'>CHANGE!</span></h2>

                <div className="text-center pb-56">
                    <Link to="/donation/dashboard" className="bg-purple-600 shadow-xl hover:bg-purple-500 text-white text-xl md:text-2xl font-semibold px-6 py-3 rounded-full">Donate Now</Link>
                </div>
            </div>
        </>
    );
};

export default Donation;