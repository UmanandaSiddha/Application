import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { Link, useLocation } from "react-router-dom";
// import { Helmet } from 'react-helmet-async';
// import { url } from "inspector";

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

    const cardData = [
        {
            id: 1,
            titleData: "Individual",
            titlePara: "Create personalized and versatile QR solutions for seamless sharing and interaction.",
            cardTitle: "Individual QR",
            color: "bg-[#6371FB]",
            titleColor: "text-[#6371FB]",
            cardPara: "Create and share personal details, contact info, or social links.",
            icons: "/individual_icon.svg"
        },
        {
            id: 2,
            titleData: "Medical",
            titlePara: "Simplify healthcare access with customized QR codes for medical records and emergency details.",
            cardTitle: "Medical QR",
            color: "bg-[#68A78B]",
            titleColor: "text-[#68A78B]",
            cardPara: "Store health records, allergies, blood group, and emergency contacts.",
            icons: "/medical_icon.svg"
        },
        {
            id: 3,
            titleData: "Creator",
            titlePara: "Create custom QR Codes and QR Cards for creators to showcase portfolios, social media links, and contact information effortlessly.",
            cardTitle: "Creator QR",
            color: "bg-[#3E5CC5]",
            titleColor: "text-[#3E5CC5]",
            cardPara: "Showcase social media, portfolio, and personal brand in one scan.",
            icons: "/creator_icon.svg"
        },
        {
            id: 4,
            titleData: "Botany",
            titlePara: "Create detailed Botany QR Codes and QR Cards to provide quick access to plant species information, research data, and educational resources.",
            cardTitle: "Botany QR",
            color: "bg-[#3F9E93]",
            titleColor: "text-[#3F9E93]",
            cardPara: "Save plant data, research, and educational insights for easy access.",
            icons: "/botany_icon.svg"
        },
        {
            id: 5,
            titleData: "Animal",
            titlePara: "Create customized Animal QR Codes and QR Cards to store important pet information, ensuring quick access to health records, identification details, and more.",
            cardTitle: "Animal QR",
            color: "bg-[#AC1400]",
            titleColor: "text-[#AC1400]",
            cardPara: "Store pet details, medical history, and owner contact information.",
            icons: "/animal_icon.svg"
        }
    ]

    const [titleData, setTitleData] = useState<any>(cardData[0].titleData)
    const [titlePara, setTitlePara] = useState<any>(cardData[0].titlePara)
    const [cardColor, setCardColor] = useState<any>(cardData[0].color)
    const [titleColor, setTitleColor] = useState<any>(cardData[0].titleColor)
    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    const handleClick = (item: any, index: any) => {
        setTitleData(item.titleData)
        setTitlePara(item.titlePara)
        setCardColor(item.color)
        setSelectedIndex(index)
        setTitleColor(item.titleColor)
    }

    return (
        <>
            {/* <Helmet>
                <title>Voolata | {location.pathname === "/about-us" ? "About Us" : "Home"}</title>
                <meta name="description" content={`This is the ${location.pathname === "/about-us" ? "about" : "home"} page of Voolata`} />
                <meta name="keywords" content="home, voolata" />
            </Helmet>

            
                {/* hero section starts here */}
            <div className="bg-[url(/bg_placeholder.png)] bg-cover bg-center lg:h-[800px] h-[560px] max-sm:pt-24 flex justify-center items-center ">
                <div className="w-[85%] mx-auto flex justify-between items-center lg:mt-8">
                    <div className="flex-col justify-center items-center">
                        <h1 className="text-white font-semibold lg:text-9xl sm:text-7xl text-6xl">Where <span className=" bg-clip-text text-transparent bg-gradient-to-br from-[#1858F0] via-[#6571FB] to-[#4D63F4] ">Work</span> <br /> Happens</h1>
                        <h3 className="font-semibold text-lg w-[80%] sm:text-xl text-white pt-7">
                            Welcome to Voolata, your go-to platform for creating <br /> versatile QR codes and links.
                        </h3>
                        <button className="bg-gradient-to-br from-[#1858F0] via-[#6571FB] to-[#4D63F4] text-white flex justify-center items-center w-36 text-lg font-semibold rounded-2xl mt-6 h-14">
                            Create now
                        </button>
                    </div>
                    <div className="hidden sm:flex">
                        <img src="/CORE_QR.png" alt="" className="lg:w-[20rem] lg:h-[20rem]" />
                    </div>

                </div>

            </div>
            {/* hero section ends here */}

            <div className="bg-gradient-to-br from-[#FFFFFF] via-[rgb(189,207,243,0.75)] to-[rgb(19,94,242,0.5)]  ">
                {/* features section starts here */}
                <div className="flex-col flex items-center pt-8 pb-32 sm:pb-36">
                    <div className="flex justify-center items-center border-[1px] font-medium text-base border-[#D4D4D4] w-36 mx-auto rounded-lg h-10 gap-2 bg-white">
                        <p>FEATURES</p>
                        <img src="/feature_icon.svg" alt="" />
                    </div>
                    <div className="flex-col flex items-center pt-8 ">
                        <h1 className="sm:text-5xl text-4xl w-[90%] font-semibold text-center">Create <span className={titleColor}>{titleData}</span> QR codes and QR Cards </h1>
                        <p className="sm:text-xl w-[90%] text-center pt-4 sm:w-[65%] text-gray-600">{titlePara}</p>
                        <button className="w-28 h-10 bg-gradient-to-br from-[#1858F0] via-[#6571FB] to-[#4D63F4] text-white font-semibold rounded-lg mt-4">
                            Get started
                        </button>
                    </div>
                    <div className="flex flex-wrap sm:w-[80%] justify-center sm:gap-6  p-3 mx-auto pt-12 ">
                        {cardData.map((item, index) => {

                            return (
                                <button onClick={() => handleClick(item, index)} key={item.id} className={`w-1/2 h-48  sm:w-64 sm:h-64 rounded-2xl outline-none border-transparent border-[1px] hover:border-[1px] hover:sm:border-black  
                                    ${selectedIndex === index ? `${cardColor}` : ''}`}>
                                    <div className=" h-full items-start flex flex-col p-5 sm:p-7 ">
                                        <img src={item.icons} alt="" className="sm:w-12 w-10" />
                                        <h2 className={`${selectedIndex === index ? 'text-white' : 'text-black'} pt-2 sm:text-2xl font-semibold text-xl`}>{item.cardTitle}</h2>
                                        <p className={`${selectedIndex === index ? 'text-white' : 'text-black'}  leading-relaxed pt-3 text-start text-xs sm:text-base h-[80%]`}>{item.cardPara}</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>


                </div>
                {/* features section ends here */}
            </div>
            {/*how it works starts here*/}
            <div className="flex flex-col items-center pt-8 pb-24 sm:pb-28 bg-gradient-to-tr from-[#FFFFFF] via-[rgb(189,207,243,0.7492)] to-[rgb(19,94,242,0.5)]">
                <div className="flex justify-center items-center border-[1px] font-medium text-base border-[#D4D4D4] w-48 mx-auto rounded-lg h-10 gap-2 bg-white">
                    <p>HOW IT WORKS</p>
                    <img src="/how_icon.svg" alt="" />
                </div>
                <div className="flex-col flex items-center pt-8  ">
                    <h1 className="text-5xl font-semibold text-center flex-wrap w-[80%] hidden sm:flex">Create, Customize, and Share Your QR Codes & Cards Effortlessly!</h1>
                    <h1 className="text-4xl  font-semibold text-center  md:hidden">Simplifying Your Journey with Us</h1>
                    <p className="sm:text-xl w-[90%] text-base text-center pt-6 flex flex-wrap  md:w-[41%]">Discover how easy it is to create custom QR codes and QR cards with Voolata! Follow these quick steps and get started in no time.</p>
                </div>

                <div className="sm:w-[80%] w-[90%] sm:h-[592px] h-48 relative flex item-center justify-center sm:gap-20 mt-10 rounded-3xl shadow-xl bg-white ">
                    <img src="/steps.svg" alt="" className="h-[72%] my-auto" />
                    <div className="flex flex-wrap sm:w-[75%] sm:gap-28 gap-5 h-[70%] my-auto pl-5 ">
                        <div className="flex flex-col justify-between">
                            <h1 className="sm:text-2xl text-xs  font-semibold">Select Category</h1>
                            <h1 className="sm:text-2xl text-xs font-semibold">Enter details</h1>
                            <h1 className="sm:text-2xl text-xs font-semibold">Preview and Edit</h1>
                            <h1 className="sm:text-2xl text-xs font-semibold">Download</h1>
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className="sm:text-xl text-[10px] h-6 max-sm:w-36 text-wrap font-medium">Select a category and fill the form.</p>
                            <p className="sm:text-xl text-[10px] h-6 max-sm:w-36 text-wrap font-medium">Submit the form to generate a QR code.</p>
                            <p className="sm:text-xl text-[10px] h-6 max-sm:w-36 text-wrap font-medium">Edit details anytime without changing the QR.</p>
                            <p className="sm:text-xl text-[10px] h-6 max-sm:w-36 text-wrap font-medium">Download and share your QR code easily.</p>
                        </div>
                    </div>
                </div>
            </div>
            {/*how it works ends here*/}

            <div id='about-us' className="flex flex-col items-center pt-8 pb-28 bg-gradient-to-br from-[#FFFFFF] via-[rgb(189,207,243,0.7492)] to-[rgb(19,94,242,0.5)]">
                <div className="flex justify-center items-center border-[1px] font-medium text-base border-[#D4D4D4] w-48 mx-auto rounded-lg h-10 gap-2 bg-white">
                    <p>ABOUT US</p>
                    <img src="/about_icon.svg" alt="" />
                </div>
                <div className="sm:w-[80%] w-[90%] mt-20">
                    <p className="sm:text-2xl text-justify text-base ">
                        Voolata is an innovative initiative by Evool Foundation, designed to simplify your life and contribute to environmental sustainability. Our platform allows you to generate QR codes and links for various purposes, reducing the need for paper and promoting eco-friendly practices. With Voolata, managing and sharing information has never been easier.
                    </p>
                </div>
            </div>
            <div className="bg-[#E4EEFF] pb-28 pt-16 flex flex-col items-center">
                <h1 className="text-4xl sm:text-3xl text-center font-bold">GET STARTED WITH VOOLATA TODAY</h1>
                <p className="sm:w-[70%] w-[90%] text-gray-700 text-center pt-6 sm:text-2xl pb-16">
                    Join Voolata to simplify information sharing through QR codes and cards
                </p>
                <div style={{ position: 'relative', width: '80%', maxWidth: '660px', aspectRatio: '16 / 9', borderRadius: '10px', overflow: 'hidden' }}>
                    <iframe
                        src="https://www.youtube.com/embed/ECpin233eTU?si=olkjyltvWiwvKkro"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{ width: '100%', height: '100%', border: 'none' }}
                    ></iframe>
                </div>

            </div>


        </>
    )
}

export default HomePage;