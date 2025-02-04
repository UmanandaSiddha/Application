import { Creator } from '@/types/card_types';
import { Link } from 'react-router-dom';

interface PropsType {
    card: Creator | null;
}

const CreatorComponent = ({ card }: PropsType) => {

    return (
        <div className='border-2 overflow-hidden pb-32 relative md:pb-6'>
            <div className="relative flex justify-center items-center">
                <img src="/creator_cover.png" alt="" className="w-full sm:h-96 h-80 block sm:hidden" />
                <img src="/creator_cover_lg.png" alt="" className='hidden md:block w-full h-80'/>
                <div className="absolute top-5">
                    <div className="flex flex-col gap-2 justify-center items-center sm:py-4">
                        <img src="/person_img.png" alt="" className="sm:w-32" />
                        <p className="text-white font-bold text-3xl pt-2">David Storm</p>
                        <p className="text-white text-2xl">Male</p>
                    </div>
                </div>
            </div>

            <div className='mt-10 mb-10 flex flex-col items-center justify-center rounded-3xl bg-[#F8F8F8] border-2 md:w-[85%]  mx-auto pb-20'>
                <div className='flex flex-col justify-center w-[80%] md:w-[40%]'>
                    <div className='mt-4'>
                        <div className='w-full py-6'>
                            {card?.links?.map((link: any, index: number) => (
                                <Link
                                    to={link.name}
                                    target="blank"
                                    className="w-full flex flex-col justify-center items-center py-5"
                                    key={index}
                                >
                                    <div className="w-full  flex justify-center items-center px-4 py-2 text-lg    bg-gradient-to-br from-[#1858F0] via-[#6571FB] to-[#4D63F4] rounded-full hover:cursor-pointer h-12 sm:h-16 border-black shadow-[8px_10px_0px_5px_rgba(0,_0,_0,_1)]">
                                        <p className='text-lg font-medium text-white'>{link.label}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center pt-10">
                    <p className="pb-3 text-xl font-semibold">Made with</p>
                    <img src="/voolata_long_r.png" alt="" className="w-36" />
                </div>
            </div>
        </div>
    );
};

export default CreatorComponent;