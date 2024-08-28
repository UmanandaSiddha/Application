import { Creator } from '@/types/card_types';
import { Link } from 'react-router-dom';
import * as icons from 'simple-icons';

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
        <div className='bg-red-200'>
            <div className="bg-red-400 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
                <div className="flex justify-start font-Kanit pl-6 py-4">
                    <p>CREATOR DATA</p>
                </div>
                <div className="font-Kanit text-5xl font-bold mb-10">
                    <h1 className="font-Alice pl-6">{card?.name}</h1>
                </div>
            </div>

            <div className='mt-6 flex justify-center w-full pb-8'>
                <div className='flex flex-col justify-center w-[80%]'>
                    <div className="flex flex-col gap-y-2 py-2 font-Kanit">
                        <p className="text-lg font-normal">Name:</p>
                        <p className="bg-white border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{card?.name}</p>
                    </div>

                    <div className='mt-4'>
                        <h2 className='font-Alice text-3xl flex justify-center'>Social Links:</h2>
                        <div className='w-full py-6'>
                            {card?.links?.map((link: any, index: number) => (
                                <Link
                                    to={link.name} target="blank"
                                    className="w-full flex flex-col justify-center items-center py-3 font-Alice text-white"
                                    key={index}
                                >
                                    <button className="w-full flex items-center justify-center gap-4 px-4 py-2 text-lg bg-red-400 rounded-lg hover:cursor-pointer border-2 border-black shadow-xl">
                                        {
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
                                        }
                                        {link.label}
                                    </button>
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