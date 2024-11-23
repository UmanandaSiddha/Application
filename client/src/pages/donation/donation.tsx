import React from "react";
import donationimg from '/assets/donationimg.jpeg'; // Replace with the actual path to your image
import DonateSvg from '/assets/donatesvg.svg'; // Added donation SVG
import ResearchSvg from '/assets/researchsvg.svg';
import ServerSvg from '/assets/serversvg.svg';
import TeamSvg from '/assets/teamsvg.svg';
import CommunitySvg from '/assets/communitysvg.svg';
import JobSvg from '/assets/jobsvg.svg';
import SustainabilitySvg from '/assets/sustainabilitysvg.svg';

const DonatePage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="h-full bg-white shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl p-10 m-8">
                {/* Title and Image Section */}
                <div className="flex items-center justify-between p-8 mb-4">
                    {/* Heading Section */}
                    <div className="flex items-start flex-col">
                        <div className="flex items-center">
                            <img
                                src={DonateSvg}
                                alt="Donation SVG"
                                className="w-10 h-10 md:w-16 md:h-16 mr-4"
                            />
                            <h1 className="text-5xl font-bold">Donation</h1>
                        </div>
                        <button className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700">
                            Donate Now 🥺
                        </button>
                    </div>

                    {/* Image Section */}
                    <div className="flex-shrink-0">
                        <img
                            src={donationimg}
                            alt="Donation Icon"
                            className="w-30 h-30 md:w-32 md:h-32 lg:w-60 lg:h-40"
                        />
                    </div>
                </div>

                {/* Why We Need Your Support Section */}
                <div className="p-8 mb-8">
                    <h1 className="text-4xl font-bold">Why We Need Your Support</h1>
                </div>

                {/* Research and Development */}
                <div className="p-8 flex items-center">
                    <img src={ResearchSvg} alt="Research Icon" className="w-12 h-12 mr-4" />
                    <div>
                        <div className="font-extrabold text-lg">Research and Development</div>
                        <p className="mt-2">
                            Innovation is at the heart of what we do. Your donations will help us invest in cutting-edge research 
                            and development to create new technological solutions that address everyday challenges and improve lives.
                        </p>
                    </div>
                </div>

                {/* Server and Maintenance Costs */}
                <div className="p-8 flex items-center">
                    <img src={ServerSvg} alt="Server Icon" className="w-12 h-12 mr-4" />
                    <div>
                        <div className="font-extrabold text-lg">Server and Maintenance Costs</div>
                        <p className="mt-2">
                            To ensure our platforms run smoothly and securely, we need to cover ongoing server and maintenance expenses. 
                            Your support helps us maintain the reliability and efficiency of our services.
                        </p>
                    </div>
                </div>

                {/* Team Support */}
                <div className="p-8 flex items-center">
                    <img src={TeamSvg} alt="Team Icon" className="w-12 h-12 mr-4" />
                    <div>
                        <div className="font-extrabold text-lg">Team Support</div>
                        <p className="mt-2">
                            Our dedicated team of professionals works tirelessly to develop and manage our platforms. Your contributions 
                            help us attract and retain top talent, ensuring that we continue to deliver high-quality solutions.
                        </p>
                    </div>
                </div>

                {/* How Your Donation Makes a Difference Section */}
                <div className="p-8 mb-8">
                    <h1 className="text-4xl font-bold">How Your Donation Makes a Difference</h1>
                </div>

                {/* Empowering Communities */}
                <div className="p-8 flex items-center">
                    <img src={CommunitySvg} alt="Community Icon" className="w-12 h-12 mr-4" />
                    <div>
                        <div className="font-extrabold text-lg">Empowering Communities</div>
                        <p className="mt-2">
                            By supporting our projects, you help us create user-friendly platforms that make life easier and more efficient 
                            for individuals and businesses.
                        </p>
                    </div>
                </div>

                {/* Creating Job Opportunities */}
                <div className="p-8 flex items-center">
                    <img src={JobSvg} alt="Job Icon" className="w-12 h-12 mr-4" />
                    <div>
                        <div className="font-extrabold text-lg">Creating Job Opportunities</div>
                        <p className="mt-2">
                            Your donations enable us to generate employment through the platforms we develop, fostering financial 
                            independence and long-term growth.
                        </p>
                    </div>
                </div>

                {/* Promoting Sustainability */}
                <div className="p-8 flex items-center">
                    <img src={SustainabilitySvg} alt="Sustainability Icon" className="w-12 h-12 mr-4" />
                    <div>
                        <div className="font-extrabold text-lg">Promoting Sustainability</div>
                        <p className="mt-2">
                            We design eco-friendly solutions that encourage sustainable living practices. Our initiatives help conserve 
                            natural resources, reduce waste, and contribute to a healthier environment overall. By promoting digital 
                            solutions, we aim to create a more sustainable future for everyone.
                        </p>
                    </div>
                </div>

                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">Together, We Can Make a Difference</h2>
                    <p className="mt-2">
                        Together, we can create a future where technology drives sustainable development and enhances the quality of 
                        life for all. Join us in our mission to make a positive impact on the world.
                    </p>
                </div>

                {/* Call to Action */}
                <div className="text-center p-8">
                    <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700">
                        Donate Now 🥺
                    </button>
                    <p className="mt-4 text-gray-600 italic">Be a part of the change!</p>
                </div>
            </div>
        </div>
    );
};

export default DonatePage;
