import { CallIcon, PawIcon } from '@/constants/cards/icons';
import { AnimalData } from '@/types/type';

interface PropTypes {
    cardData: AnimalData;
}

const AnimalViewCard = ({ cardData }: PropTypes) => {
    const data = [
        { label: "Sign Illness", value: cardData.signIllness || "" },
        { label: "Vaccination", value: cardData.vaccination || "" },
        { label: "Physical Description", value: cardData.physicalDescription || "" },
        { label: "Diet", value: cardData.diet || "" },
        { label: "Lifespan", value: cardData.lifespan || "" },
        { label: "Behavior", value: cardData.behavior || "" },
        { label: "Common Health", value: cardData.commonHealth || "" },
        { label: "Location", value: cardData.location || "" },
        { label: "Additional Notes", value: cardData.additionalNotes || "" }
    ]    
    
    return (
        <div className='w-full md:w-[50%] lg:w-[30%] mx-auto px-6'>
            <div className='mt-6 flex flex-col justify-start items-start gap-2'>
                <p className='text-md text-[#454545] font-bold whitespace-nowrap'>Species :</p>
                <div className='flex shadow-[4px_17px_16px_3px_rgba(0,_0,_0,_0.1)] bg-white w-full p-4 rounded-2xl items-center gap-3'>
                    <img src={PawIcon} alt="" className='w-12 h-12' />
                    <p className='text-xl font-semibold'>{cardData.species}</p>
                </div>
            </div>
            <div className='mt-8 w-full flex flex-col justify-start items-start gap-2 px-3'>
                {data.map(dat => (
                    <div key={dat.label} className='flex flex-wrap items-center gap-2'>
                        <p className='text-md text-[#454545] font-bold whitespace-nowrap'>{dat.label} :</p>
                        <p className='text-md text-[#2E2E2E] whitespace-nowrap'>{dat.value ? dat.value : "----------"}</p>
                    </div>
                ))}
            </div>
            <div className='mt-6 flex flex-col justify-start items-start gap-2'>
                <p className='text-md text-[#454545] font-bold whitespace-nowrap'>Owner :</p>
                <a href={`tel:${cardData.caretakerMobileNumber}`} className='flex shadow-[4px_17px_16px_3px_rgba(0,_0,_0,_0.1)] bg-white w-full p-4 rounded-2xl items-center gap-3'>
                    <img src={CallIcon} alt="call icon" className='w-12 h-12' />
                    <p className='text-xl font-semibold'>{cardData.ownerName}</p>
                </a>
            </div>
        </div>
    )
}

export default AnimalViewCard;