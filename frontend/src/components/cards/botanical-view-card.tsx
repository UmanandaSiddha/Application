

const BotanicalViewCard = () => {
    const data = [
        { label: 'Scientific Name', value: 'Acer pseudoplatanus' },
        { label: 'Common Name', value: 'Platanus' },
        { label: 'Family', value: 'Rosaceae' },
        { label: 'Genus', value: 'Acer' },
        { label: 'Height', value: '10-15 cm' },
        { label: 'Diameter', value: '8-10 cm' },
        { label: 'Flowers', value: '' },
        { label: 'Flower Color', value: 'Purple and white' },
        { label: 'Seeds', value: 'White and yellow' },
        { label: 'Leaf Shape', value: 'Oval or elliptical' },
        { label: 'Leaf Color', value: 'Green and white' },
    ]
    return (
        <div className='w-full md:w-[50%] lg:w-[30%] mx-auto px-6'>
            <div className='mt-12 w-full flex flex-col justify-start items-start gap-2 px-3'>
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