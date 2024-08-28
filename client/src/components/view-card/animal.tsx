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
        <div className="bg-orange-100">
            <div className="bg-orange-300 py-4 rounded-br-[4rem] rounded-bl-[3rem] z-10 shadow-lg">
                <div className="flex justify-start font-Kanit pl-6 py-4">
                    <p>ANIMAL DATA</p>
                </div>
                <div className="font-Kanit text-5xl font-bold mb-10">
                    <h1 className="font-Alice pl-6">{card?.name}</h1>
                </div>
            </div>

            <div className="py-6 flex justify-center w-full">
                <div className="w-[90%]">
                   {data.map((item, index) => (
                        <div key={index} className="flex flex-col gap-y-2 py-2 font-Kanit">
                            <p className="text-lg font-normal">{item.title}:</p>
                            <p className="bg-white border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-lg">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AnimalComponent;