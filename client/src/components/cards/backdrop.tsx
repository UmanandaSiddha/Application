const Backdrop = () => {
    return (
        <div
            id="backdrop"
            className="absolute left-[-9999px] w-[220px] h-[330px] bg-[url(/backdrop.png)] bg-cover flex flex-col items-start p-3 gap-5"
        >
            <img src="/voolata_long_r.png" alt="Voolata Logo" className="w-24" />
            <p className="h-16 text-[6px] text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut hendrerit odio...
            </p>
        </div>
    );
};

export default Backdrop;


