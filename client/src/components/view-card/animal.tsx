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
            title: "Species",
            value: card?.species
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
            title: "Owner",
            value: card?.owner
        },
        { 
            title: "Phone",
            value: card?.phone
        },
    ]

    return (
        <div className="bg-red-100 pb-32 md:pb-6">
            <div className="bg-red-400 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
                <div className="flex justify-start pl-6 py-4">
                    <p className="text-white">ANIMAL DATA</p>
                </div>
                <div className="text-5xl font-semibold mb-10">
                    <h1 className="pl-6 text-3xl md:text-5xl text-white">{card?.name}</h1>
                </div>
            </div>

            <div className="py-6 flex justify-center w-full">
                <div className="w-[90%]">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col gap-y-2 py-2">
                            <p className="text-lg font-semibold">{item.title}:</p>
                            <p className="bg-white border-2 border-slate-200 w-full rounded-lg px-3 py-1 text-lg shadow-lg">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AnimalComponent;