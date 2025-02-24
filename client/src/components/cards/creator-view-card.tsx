import { setSvg } from "@/lib/helper";
import { CreatorData } from "@/types/type";
import { Link } from "react-router-dom";

interface PropTypes {
    cardData: CreatorData;
}

const CreatorViewCard = ({ cardData }: PropTypes) => {
    return (
        <div className='w-full md:w-[50%] lg:w-[30%] mx-auto px-6'>
            <div className='flex flex-col justify-center w-full'>
                <div className='w-full py-6'>
                    {cardData && cardData.links?.length > 0 ? cardData.links.map((link, index: number) => (
                        <Link
                            to={link.link}
                            target="blank"
                            className="w-full relative flex flex-col justify-center items-center py-3"
                            key={index}
                        >
                            <div className="absolute left-0 px-6">
                                <svg
                                    className="fill-current"
                                    width="25"
                                    height="25"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d={setSvg(link.label)}
                                        fill="white"
                                    />
                                </svg>
                            </div>
                            <div className="w-full  flex justify-center items-center px-4 py-4 text-lg bg-gradient-to-br from-[#1858F0] via-[#6571FB] to-[#4D63F4] rounded-full hover:cursor-pointer border-2 border-black shadow-[3px_3px_0px_3px_rgba(0,_0,_0,_1)]">
                                <p className='text-lg font-bold text-white'>{link.label}</p>
                            </div>
                        </Link>
                    )) : (
                        <p className='text-center text-gray-500 text-lg'>No links available</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreatorViewCard;