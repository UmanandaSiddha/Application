import { Animal } from "@/types/card_types";

interface PropsType {
    card: Animal | null;
}

const AnimalComponent = ({ card }: PropsType) => {

    const data = [
        {
            title: "Scientific Name",
            value: card?.scientificName
        },
        {
            title: "Habitat",
            value: card?.habitat
        },
        {
            title: "Geographical Range",
            value: card?.geographicalRange
        },
        {
            title: "Physical Description",
            value: card?.physicalDescription
        },
        {
            title: "Diet",
            value: card?.diet
        },
        {
            title: "Lifespan",
            value: card?.lifespan
        },
        {
            title: "Behavior",
            value: card?.behavior
        },
        {
            title: "Conservation Status",
            value: card?.conservationStatus
        },
        {
            title: "Location",
            value: card?.location
        },
        {
            title: "Caretaker Mobile Number",
            value: card?.caretakerMobileNumber
        },
        {
            title: "Additional Notes",
            value: card?.additionalNotes
        }
    ];

    return (
        <div className="relative pb-32 md:pb-20 border-2">
            <div className="relative flex justify-center items-center">
                <img src="/animal_cover.png" alt="" className="w-full h-80 sm:h-96 sm:hidden block " />
                <img src="/animal_cover_lg.png" alt="" className="hidden md:block w-full h-80"/>
                <div className="absolute top-5">
                    <div className="flex flex-col gap-2 justify-center items-center sm:py-4">
                        <img src="/person_img.png" alt="" className="sm:w-32" />
                        <p className="text-white font-bold text-3xl pt-2">David Storm</p>
                        <p className="text-white text-2xl">Male</p>
                    </div>
                </div>
            </div>

            <div className="py-6 flex flex-col items-center bg-[#F7F7F7] justify-center w-[85%] mx-auto pb-20  mt-12 rounded-3xl">
                <div className="w-[90%] md:w-[40%]">
                    <div className="flex flex-col  gap-y-2 py-2">
                        <p className="text-lg font-bold">Animal Name</p>
                        <div className="flex shadow-[4px_17px_16px_3px_rgba(0,_0,_0,_0.1)] bg-white h-20 sm:h-24 rounded-3xl items-center border-2 pl-5 gap-5">
                            <div className="bg-[#FCDBC1] w-12 h-10 sm:w-16 sm:h-14 rounded-2xl flex items-center justify-center">
                                <img src="/paw.svg" alt="" className="sm:h-8" />
                            </div>
                            <p className="bg-white h-14 md:font-bold font-semibold text-xl md:text-2xl border-slate-200 w-full rounded-xl px-3 flex items-center py-1 ">{card?.name}</p>
                        </div>
                    </div>
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col  gap-y-2 py-2">
                            <p className="text-lg font-semibold">{item.title}:</p>
                            <p className="bg-white border-2 pl-10 h-14 border-slate-200 w-full rounded-xl px-3 flex items-center  text-lg">{item.value}</p>
                        </div>
                    ))}
                </div>
                <div className="w-[90%] md:w-[40%] h-20 shadow-lg mt-10 rounded-2xl bg-white flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <img src="/person_img.png" alt="" className="w-12 ml-10" />
                        <h1 className="sm:text-2xl font-semibold text-gray-500">David Storm</h1>
                    </div>
                    <img src="/call.png" alt="" className="w-12 mr-10"/>
                </div>
                <div className="flex flex-col justify-center items-center pt-10">
                    <p className="pb-3 text-xl font-semibold">Made with</p>
                    <img src="/voolata_long_r.png" alt="" className="w-36" />
                </div>
            </div>

        </div>
    );
};

export default AnimalComponent;