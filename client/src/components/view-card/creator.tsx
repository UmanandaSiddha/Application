import { Creator } from '@/types/card_types';
import { Link } from 'react-router-dom';
import * as icons from 'simple-icons';
import { IoMdLink } from "react-icons/io";

interface PropsType {
    card: Creator | null;
}

const CreatorComponent = ({ card }: PropsType) => {

    const setSvg = (input: string) => {
        const platformKey = `si${input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()}`;
        const icon = icons[platformKey as keyof typeof icons];
        if (icon) {
            return icon.path;
        } else {
            return "";
        }
    }

    return (
        <div className='bg-cyan-100 pb-32 md:pb-6'>
            <div className="bg-cyan-400 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
                <div className="flex justify-start pl-6 py-4">
                    <p className='text-white'>CREATOR DATA</p>
                </div>
                <div className="text-5xl font-semibold mb-10">
                    <h1 className="pl-6 text-3xl md:text-5xl text-white">{card?.name}</h1>
                </div>
            </div>

            <div className='mt-6 flex justify-center w-full pb-8'>
                <div className='flex flex-col justify-center w-[80%]'>
                    <div className="flex flex-col gap-y-2 py-2">
                        <p className="text-lg font-semibold">Name:</p>
                        <p className="bg-white border-2 border-slate-200 w-full rounded-lg px-3 py-1 text-lg shadow-lg">{card?.name}</p>
                    </div>

                    <div className='mt-4'>
                        <h2 className='text-3xl flex justify-center'>Social Links:</h2>
                        <div className='w-full py-6'>
                            {card?.links?.map((link: any, index: number) => (
                                <Link
                                    to={link.name} target="blank"
                                    className="w-full flex flex-col justify-center items-center py-3"
                                    key={index}
                                >
                                    <div className="w-full flex justify-center items-center px-4 py-2 text-lg bg-cyan-300 rounded-lg hover:cursor-pointer border-2 border-black shadow-xl">
                                        <div className='p-2'>
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
                                        </div>
                                        <p className='text-lg font-normal italic'>{link.label}</p>
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