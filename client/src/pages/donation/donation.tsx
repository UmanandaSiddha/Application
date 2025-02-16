import { Helmet } from "react-helmet-async";
// import Slider from "react-slick";
import donation from '../../assets/extra/donation.svg';
import inovation from '../../assets/extra/innovation.svg';
import server from '../../assets/extra/server.svg';
import support from '../../assets/extra/support.svg';
// import sustain from '../../assets/extra/sustain.svg';
// import foster from '../../assets/extra/foster.svg';
import arrow from '../../assets/extra/arrow.svg';
import rocket from '../../assets/extra/rocket.svg';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const data = [
//     {
//         title: "Sustainability",
//         image: sustain,
//         alt: "Sustainability",
//         description: "Sustainable innovations that support the future.",
//     },
//     {
//         title: "Empowering Communities",
//         image: foster,
//         alt: "Empowerment",
//         description: "Building smarter, user-friendly solutions.",
//     },
//     {
//         title: "Creating Jobs",
//         image: foster,
//         alt: "Jobs",
//         description: "Fostering employment and economic growth.",
//     }
// ];

const Donation = () => {
    // var settings = {
    //     dots: true,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     responsive: [
    //         {
    //             breakpoint: 1024,
    //             settings: { slidesToShow: 2, slidesToScroll: 1, dots: true }
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: { slidesToShow: 1, slidesToScroll: 1 }
    //         }
    //     ]
    // };
    return (
        <>
            <Helmet>
                <title>Voolata | Donation</title>
                <meta name="description" content={`This is the donation page of Voolata`} />
                <meta name="keywords" content="donation, voolata" />
            </Helmet>
            {/* <div className='w-[85%] mx-auto lg:mt-0 mt-10' > */}
            <div className='p-6 md:p-10 lg:p-20'>
                <div className='flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-6'>
                    <div className='lg:w-1/2'>
                        <p className='text-2xl sm:text-3xl md:text-4xl font-bold leading-tight'>
                            Donate now and be a part of the <span className='text-[#1858F0]'>Change!</span>
                        </p>
                        <p className='text-base sm:text-lg md:text-xl mt-3 text-gray-700'>
                            Join us in our mission to make a positive impact on the world.
                        </p>
                        <button className='mt-5 px-6 py-2 text-lg font-bold bg-[#1858F0] text-white rounded-lg hover:bg-blue-700 transition'>
                            Donate
                        </button>
                    </div>
                    <div className='lg:w-1/2 flex justify-center'>
                        <img src={donation} alt="Donation Illustration" className='w-40 sm:w-52 md:w-64' />
                    </div>
                </div>

                <div className='mt-12 md:mt-16 text-center'>
                    <p className='text-2xl sm:text-3xl md:text-4xl font-semibold'>
                        Why Do We Need Your <span className='text-[#1858F0]'>Support</span>?
                    </p>
                    <p className='mt-4 md:mt-5 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-700'>
                        Your donations help fund research, server maintenance, and team growth, ensuring our platforms remain secure and innovative.
                    </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-12 md:mt-16'>
                    <div className='border border-gray-300 shadow-lg rounded-lg p-6 text-center'>
                        <img src={inovation} alt='Innovation & Research' className='mx-auto mb-4 w-16' />
                        <p className='text-lg font-bold'>Innovation & Research</p>
                        <p className='text-gray-700 mt-2 text-sm'>
                            Driving new technological advancements to solve everyday challenges.
                        </p>
                    </div>
                    <div className='border border-gray-300 shadow-lg rounded-lg p-6 text-center'>
                        <img src={server} alt='Server & Maintenance' className='mx-auto mb-4 w-16' />
                        <p className='text-lg font-bold'>Server & Maintenance</p>
                        <p className='text-gray-700 mt-2 text-sm'>
                            Ensuring our platforms run smoothly, securely, and efficiently.
                        </p>
                    </div>
                    <div className='border border-gray-300 shadow-lg rounded-lg p-6 text-center'>
                        <img src={support} alt='Team Support' className='mx-auto mb-4 w-16' />
                        <p className='text-lg font-bold'>Team Support</p>
                        <p className='text-gray-700 mt-2 text-sm'>
                            Helping us attract and retain top talent to continue delivering high-quality solutions.
                        </p>
                    </div>
                </div>

                <div className='mt-12 md:mt-16 text-center'>
                    <p className='text-2xl sm:text-3xl font-semibold'>
                        How Your <span className='text-[#1858F0]'>Donations</span> Help
                    </p>
                    <p className='mt-4 max-w-lg mx-auto text-base sm:text-lg text-gray-700'>
                        Your donation empowers innovation, creates jobs, and drives a sustainable future!
                    </p>
                </div>

                {/* <div className='mt-6 md:mt-10'>
                    <Slider {...settings}>
                        {data.map((item, index) => (
                            <div key={index} className='p-4'>
                                <div className='p-6 rounded-lg shadow-lg text-center bg-gray-100'>
                                    <img src={item.image} alt={item.alt} className='mx-auto mb-4 w-20' />
                                    <p className='text-lg font-bold'>{item.title}</p>
                                    <p className='text-gray-700 mt-2 text-sm'>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div> */}

                <div className='mt-12 md:mt-16 bg-gray-200 p-6 sm:p-8 md:p-10 lg:p-12 rounded-[32px] md:rounded-[64px] text-center relative max-w-[90%] md:max-w-3xl mx-auto flex flex-col items-center'>
                    <img src={arrow} className='absolute top-[-20px] left-4 hidden sm:block' alt="Arrow" />

                    <p className='text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold leading-tight'>
                        Together, We Create Impact!
                    </p>

                    <p className='mt-2 text-gray-700 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] max-w-xl sm:max-w-2xl mx-auto'>
                        Your donations help drive innovation, create job opportunities, and promote sustainability. Join us in making a lasting impact.
                    </p>

                    <button className='mt-5 px-6 py-3 text-lg font-bold bg-[#1858F0] text-white rounded-lg hover:bg-blue-700 transition'>
                        Donate Now
                    </button>

                    <img src={rocket} alt="Rocket" className='absolute bottom-[-20px] right-4 w-10 sm:w-12 hidden sm:block' />
                </div>

            </div>
        </>
    );
};

export default Donation;