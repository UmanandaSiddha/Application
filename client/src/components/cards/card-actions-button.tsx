interface PropTypes {
    imageSrc: string;
    placeholder: string;
    onClick: () => void;
}

const CardActionsButton = ({ imageSrc, placeholder, onClick }: PropTypes) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col justify-center items-center md:h-26 space-x-2 md:space-y-0 space-y-2 shadow-lg bg-white px-5 py-4 rounded-3xl w-1/2`}
        >
            <img src={imageSrc} alt={placeholder} className="w-8" />
            <p className="text-gray-500 text-lg font-semibold">{placeholder}</p>
        </button>
    )
}

export default CardActionsButton;