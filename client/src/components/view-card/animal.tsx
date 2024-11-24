import { Animal } from "@/types/card_types";

interface PropsType {
    card: Animal | null;
}

const AnimalComponent = ({ card }: PropsType) => {

    const data = [

        {
            title: "Name",
            value: card?.name
        },
        {
            title: "Age",
            value: card?.age
        },
        {
            title: "Gender",
            value: card?.gender
        },
        {
            title: "Color",
            value: card?.color
        },
        {
            title: "Location",
            value: card?.location
        },
        {
            title: "Phone",
            value: card?.phone
        },
    ]

    return (
        <div className="bg-[#F2EAE8] relative pb-32 md:pb-6">
            <img src="/botany_bg.png" alt="" className="absolute md:left-16 max-sm:top-24 rotate-6 z-10 " />
            <div className="rounded-[10px] relative">
                <img src="/animal_header.png" alt="" className="w-full h-80" />
                <div className='pt-10 pl-5 absolute top-5'>
                    <div className="flex justify-start pl-6 py-4">
                        <p className="text-white font-bold text-lg">Animal Data</p>
                    </div>
                    <div className="text-white text-5xl lg:text-5xl xl:text-6xl sm:text-4xl font-semibold mb-10">
                        <h1 className="pl-6">{card?.name}</h1>
                    </div>
                </div>
            </div>

            <div className="py-6 flex justify-center w-full pb-20">
                <div className="w-[90%]">
                    <div className="flex flex-col  gap-y-2 py-2">
                        <p className="text-lg font-bold">Species</p>
                        <div className="flex shadow-[4px_17px_16px_3px_rgba(0,_0,_0,_0.1)] bg-white h-24 rounded-3xl items-center border-2 pl-5 gap-5">
                            <div className="bg-[#FCDBC1]  w-16 h-14 rounded-2xl flex items-center justify-center">
                                <img src="/paw.svg" alt="" className="h-8" />
                            </div>
                            <p className="bg-white h-14 md:font-bold font-semibold text-xl md:text-2xl border-slate-200 w-full rounded-xl px-3 flex items-center py-1 ">{card?.species}</p>
                        </div>
                    </div>
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col  gap-y-2 py-2">
                            <p className="text-lg font-semibold">{item.title}:</p>
                            <p className="bg-white border-2 pl-10 h-14 border-slate-200 w-full rounded-xl px-3 flex items-center  text-lg">{item.value}</p>
                        </div>
                    ))}

                    <div className="flex flex-col  gap-y-2  py-2">
                        <p className="text-lg font-bold">Owner</p>
                        <div className="flex shadow-[4px_17px_16px_3px_rgba(0,_0,_0,_0.1)] bg-white h-28 rounded-3xl items-center border-2 pl-5 gap-5">
                            <p className="bg-white h-14 md:font-bold font-semibold text-2xl md:text-3xl border-slate-200 w-full rounded-xl px-3 flex items-center">{card?.owner}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AnimalComponent;