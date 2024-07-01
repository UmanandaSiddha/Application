import { Animal } from "@/types/card_types";

interface PropsType {
    card: Animal | null;
}

const AnimalComponent = ({ card }: PropsType) => {
    return (
        <>
            <div className="relative flex flex-col w-full bg-orange-300 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
                <div className="flex justify-start font-Kanit pl-6 py-4">
                    <p className="">Animal Data</p>
                </div>
                <div className="flex justify-start font-Kanit text-5xl font-bold mb-10">
                    <h1 className="font-Alice pl-6">{card?.name}</h1>
                </div>
            </div>
            <div className="relative flex justify-center lg:mb-2 lg:rounded-b-xl bg-orange-100 font-Kanit -mt-[4rem]">
                <div className="flex flex-col w-[90%] mt-[6rem]">
                    <div className="flex flex-col w-full py-2">
                        <div className="flex justify-start">
                            <label htmlFor="">Species:</label>
                        </div>
                        <div className="w-full flex justify-center pt-2">
                            <div className="border-2 bg-white border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{card?.species}</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full py-2">
                        <div className="flex justify-start">
                            <label htmlFor="">Name:</label>
                        </div>
                        <div className="w-full flex justify-center pt-2">
                            <div className="border-2 bg-white border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{card?.name}</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full py-2">
                        <div className="flex justify-start">
                            <label htmlFor="">Age:</label>
                        </div>
                        <div className="w-full flex justify-center pt-2">
                            <div className="border-2 bg-white border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{card?.age}</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full py-2">
                        <div className="flex justify-start">
                            <label htmlFor="">Location:</label>
                        </div>
                        <div className="w-full flex justify-center pt-2">
                            <div className="border-2 bg-white border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{card?.location}</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full py-2">
                        <div className="flex justify-start">
                            <label htmlFor="">Gender:</label>
                        </div>
                        <div className="w-full flex justify-center pt-2">
                            <div className="border-2 bg-white border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{card?.gender}</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full py-2">
                        <div className="flex justify-start">
                            <label htmlFor="">Colour/Markings:</label>
                        </div>
                        <div className="w-full flex justify-center pt-2">
                            <div className="border-2 bg-white border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{card?.color}</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full py-2">
                        <div className="flex justify-start">
                            <label htmlFor="">Owner:</label>
                        </div>
                        <div className="w-full flex justify-center pt-2">
                            <div className="border-2 bg-white border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{card?.owner}</div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full py-2">
                        <div className="flex justify-start">
                            <label htmlFor="">Phone Number:</label>
                        </div>
                        <div className="w-full flex justify-center pt-2">
                            <div className="border-2 bg-white border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{card?.phone}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnimalComponent;
