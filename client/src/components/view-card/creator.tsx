import { Creator } from '@/types/card_types';
import { Link } from 'react-router-dom';
// import * as icons from 'simple-icons';
// import { IoMdLink } from "react-icons/io";

interface PropsType {
    card: Creator | null;
}

const CreatorComponent = ({ card }: PropsType) => {

    // const setSvg = (input: string) => {
    //     const platformKey = `si${input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()}`;
    //     const icon = icons[platformKey as keyof typeof icons];
    //     if (icon) {
    //         return icon.path;
    //     } else {
    //         return "";
    //     }
    // }

    return (
        <div className='bg-[#A383FF] overflow-x-hidden pb-32 relative md:pb-6'>
            <img src="/personal_curve.png" alt="" className="absolute md:right-10 md:top-10 md:rotate-6 z-10 " />
            <div className="relative mb-20 rounded-[10px]">
                <img src="/card_header_bg.png" alt="" className="w-full h-80 hidden sm:block" />
                <img src="/creator_header_mobile.png" alt="" className="w-full sm:hidden"/>

                <div className='pt-10 pl-5 absolute top-5 '>
                    <div className="flex justify-start pl-6 py-4">
                        <p className='text-white font-bold text-lg'>Creator's Data</p>
                    </div>
                    <div className="text-white text-5xl lg:text-5xl xl:text-6xl sm:text-4xl font-semibold mb-10">
                        <h1 className="pl-6">{card?.name}</h1>
                    </div>
                </div>
            </div>

            <div className='mt-6 mb-10 flex justify-center rounded-3xl bg-[#F7F7F7] border-2 md:w-[550px] w-[370px] mx-auto pb-20'>
                <div className='flex flex-col justify-center w-[80%]'>
                    {/* <div className="flex flex-col gap-y-2 py-2">
                        <p className="text-lg font-semibold">Name:</p>
                        <p className="bg-white border-2 border-slate-200 w-full rounded-lg px-3 py-1 text-lg shadow-lg">{card?.name}</p>
                    </div> */}

                    <div className='mt-4'>
                        <div className='w-full py-6'>
                            {card?.links?.map((link: any, index: number) => (
                                <Link
                                    to={link.name} target="blank"
                                    className="w-full flex flex-col justify-center items-center py-5"
                                    key={index}
                                >
                                    <div className="w-full flex justify-center items-center px-4 py-2 text-lg bg-[#5674DC] rounded-2xl hover:cursor-pointer border-[3px] h-14 border-black shadow-[4px_17px_16px_3px_rgba(0,_0,_0,_0.1)]">
                                        {/* <div className='p-2'>
                                            {setSvg(link.label) === "" ? (
                                                <IoMdLink size={25} className='text-black' />
                                            ) : (
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d={setSvg(link.label)}
                                                        fill="black"
                                                    />
                                                </svg>
                                            )}
                                        </div> */}
                                        <p className='text-lg font-medium text-white'>{link.label}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorComponent;