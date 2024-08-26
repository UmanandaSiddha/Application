import { Creator } from '@/types/card_types';

interface PropsType {
    card: Creator | null;
}

const CreatorComponent = ({ card }: PropsType) => {
    return (
        <>
            <div className="relative flex flex-col w-full bg-blue-400 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
                <div className="flex justify-start font-Kanit pl-6 py-4">
                    <p className="">Creator's Data</p>
                </div>
                <div className="flex justify-start font-Kanit text-5xl font-bold mb-10">
                    <h1 className="font-Alice pl-6">{card?.name}</h1>
                </div>
            </div>

            <div className="relative flex justify-center bg-violet-400 lg:mb-2 lg:rounded-b-xl font-Kanit -mt-[4rem] lg:pb-[8rem]">
                <div className="flex flex-col w-[90%] mt-[6rem]">
                    <div className="flex flex-col w-full py-2">
                        <div className="lg:flex lg:justify-center">
                            <div className="lg:w-1/2">
                                <label htmlFor="name" className="flex justify-start lg:text-xl">Name:</label>
                            </div>
                        </div>
                        <div className="w-full flex justify-center pt-2">
                            <input
                                type="text"
                                className="border-2 border-slate-200 w-full lg:w-1/2 rounded-lg font-Philosopher pl-3 py-1 text-lg shadow-lg"
                                defaultValue={card?.name}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-full py-2">
                        <div className="flex justify-center font-Alice text-2xl py-2">
                            <p>Social Links:</p>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-[90%] lg:w-[50%] bg-white flex flex-col justify-center py-4 rounded-2xl shadow-lg">
                                {card?.links?.map((link: any, index: number) => (
                                    <div
                                        className="flex flex-col justify-center items-center py-2 font-Alice text-white"
                                        key={index}
                                    >
                                        <a href={link.name} target="blank">
                                            <div className="w-full">
                                                <button className="flex items-center justify-center gap-4 w-[16rem] py-2 bg-blue-500 rounded-lg hover:cursor-pointer border-2 border-black shadow-xl">
                                                    {link.label}
                                                </button>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreatorComponent;
