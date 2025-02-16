import { BotanyData } from "@/types/type";

interface PropTypes {
    cardData: BotanyData;
}

const BotanicalViewCard = ({ cardData }: PropTypes) => {
    const data = [
        { label: "Scientific Name", value: cardData.scientificName || "" },
        { label: "Water Requirement", value: cardData.waterRequirement || "" },
        { label: "Sunlight Requirement", value: cardData.sunlightRequirement || "" },
        { label: "Common Pests & Diseases", value: cardData.commonPestsDiseases || "" },
        { label: "Description", value: cardData.description || "" },
        { label: "Height", value: cardData.height || "" },
        { label: "Leaf Type", value: cardData.leafType || "" },
        { label: "Symptoms", value: cardData.symptoms || "" },
        { label: "Nutritional Needs", value: cardData.nutritionalNeeds || "" },
        { label: "Care Instructions", value: cardData.careInstructions || "" },
        { label: "Special Features", value: cardData.specialFeatures || "" },
        { label: "Caretaker Mobile Number", value: cardData.caretakerMobileNumber || "" },
        { label: "Additional Notes", value: cardData.additionalNotes || "" }
    ]
    return (
        <div className='w-full md:w-[50%] lg:w-[30%] mx-auto px-6'>
            <div className='mt-12 w-full flex flex-col justify-start items-start gap-4 px-3'>
                {data.map(dat => (
                    <div key={dat.label} className='flex flex-wrap items-center gap-2'>
                        <p className='text-md text-[#454545] font-bold whitespace-nowrap'>{dat.label} :</p>
                        <p className='text-md text-[#2E2E2E] whitespace-nowrap'>{dat.value ? dat.value : "----------"}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BotanicalViewCard;