import { useNavigate } from "react-router-dom";
import donationimg from '/donationimg.jpeg';
import DonateSvg from '/donatesvg.svg';
import ResearchSvg from '/researchsvg.svg';
import ServerSvg from '/serversvg.svg';
import TeamSvg from '/teamsvg.svg';
import CommunitySvg from '/communitysvg.svg';
import JobSvg from '/jobsvg.svg';
import SustainabilitySvg from '/sustainabilitysvg.svg';

const Donation = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="h-full bg-white shadow-xl w-full max-w-4xl rounded-lg p-6 sm:p-8 m-4">

                {/* Donate Now Button at Top */}
                <div className="flex justify-center mb-8">
                    <button onClick={() => navigate("/donation/dashboard")} className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition-all">
                        Donate Now 🥺
                    </button>
                </div>

                {/* Donation Heading with Image */}
                <div className="flex flex-col md:flex-row items-center justify-between p-6 mb-8 space-y-6 md:space-y-0">
                    <div className="flex items-start flex-col text-center md:text-left">
                        <div className="flex items-center">
                            <img
                                src={DonateSvg}
                                alt="Donation SVG"
                                className="w-14 h-14 md:w-16 md:h-16 mr-4"
                            />
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Donation</h1>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <img
                            src={donationimg}
                            alt="Donation Icon"
                            className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-40"
                        />
                    </div>
                </div>

                {/* Why We Need Your Support Section */}
                <div className="px-6 mb-8">
                    <h1 className="text-3xl font-bold mb-4">Why We Need Your Support</h1>
                    <div className="space-y-6">
                        {[
                            {
                                icon: ResearchSvg,
                                title: "Research and Development",
                                description: "Innovation is at the heart of what we do. Your donations will help us invest in cutting-edge research and development to create new technological solutions that address everyday challenges and improve lives."
                            },
                            {
                                icon: ServerSvg,
                                title: "Server and Maintenance Costs",
                                description: "To ensure our platforms run smoothly and securely, we need to cover ongoing server and maintenance expenses. Your support helps us maintain the reliability and efficiency of our services."
                            },
                            {
                                icon: TeamSvg,
                                title: "Team Support",
                                description: "Our dedicated team of professionals works tirelessly to develop and manage our platforms. Your contributions help us attract and retain top talent, ensuring that we continue to deliver high-quality solutions."
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <img src={item.icon} alt={`${item.title} Icon`} className="w-12 h-12" />
                                <div>
                                    <div className="font-extrabold text-lg">{item.title}</div>
                                    <p className="mt-2 text-base leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How Your Donation Makes a Difference Section */}
                <div className="px-6 mb-8">
                    <h1 className="text-3xl font-bold mb-4">How Your Donation Makes a Difference</h1>
                    <div className="space-y-6">
                        {[
                            {
                                icon: CommunitySvg,
                                title: "Empowering Communities",
                                description: "By supporting our projects, you help us create user-friendly platforms that make life easier and more efficient for individuals and businesses."
                            },
                            {
                                icon: JobSvg,
                                title: "Creating Job Opportunities",
                                description: "Your donations enable us to generate employment through the platforms we develop, fostering financial independence and long-term growth."
                            },
                            {
                                icon: SustainabilitySvg,
                                title: "Promoting Sustainability",
                                description: "We design eco-friendly solutions that encourage sustainable living practices. Our initiatives help conserve natural resources, reduce waste, and contribute to a healthier environment overall. By promoting digital solutions, we aim to create a more sustainable future for everyone."
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <img src={item.icon} alt={`${item.title} Icon`} className="w-12 h-12" />
                                <div>
                                    <div className="font-extrabold text-lg">{item.title}</div>
                                    <p className="mt-2 text-base leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Closing Statement */}
                <div className="px-6 mb-8 text-center">
                    <h2 className="text-2xl font-bold">Together, We Can Make a Difference</h2>
                    <p className="mt-4 text-base leading-relaxed">
                        Together, we can create a future where technology drives sustainable development and enhances the quality of life for all. Join us in our mission to make a positive impact on the world.
                    </p>
                </div>

                {/* Donate Now Button at Bottom */}
                <div className="text-center mb-4">
                    <button onClick={() => navigate("/donation/dashboard")} className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-700 transition-all">
                        Donate Now 🥺
                    </button>
                    <p className="mt-4 text-gray-600 italic">Be a part of the change!</p>
                </div>
            </div>
        </div>
    );
};

export default Donation;
