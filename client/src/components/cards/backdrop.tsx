const Backdrop = () => {
    return (
        <div
            id="backdrop"
            className="absolute left-[-9999px] w-[220px] h-[330px] bg-[url(/backdrop.png)] bg-cover flex flex-col items-start p-3 gap-5"
        >
            <img src="/voolata_long_r.png" alt="Voolata Logo" className="w-24" />
            <p className="h-16 text-[6px] text-white">
                105, P-17, Omkar CHS Ltd, Noopur Nagar Mataji Mandir, Mira Road, Thane, Thane- 401107
                <br />
                +91 91368 95794
                <br />
                contactus@evoolfoundation.org
            </p>
        </div>
    );
};

export default Backdrop;