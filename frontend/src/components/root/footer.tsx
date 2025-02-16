

const Footer = () => {
    return (
        <>
            <div className="flex flex-col lg:pr-20 lg:flex-row max-lg:items-center lg:justify-between max-lg:gap-10 pt-16 lg:pb-56 pb-12 ">
                <div className="flex flex-col lg:pl-20 gap-3 max-lg:text-center">
                    <img src="/voolata_long_r.png" alt="" className="w-32 max-lg:mx-auto" />
                    <p className="w-64">Lorem ipsum dolor sit amet consectetur.</p>
                </div>

                <div className="flex lg:flex-row  flex-col lg:gap-20 max-lg:items-center gap-10">
                    <div className="flex flex-col gap-3 max-lg:text-center">
                        <h1 className="font-semibold text-2xl">Company</h1>
                        <ul className="list-none flex flex-col gap-1">
                            <li>About us</li>
                            <li>Donation</li>
                            <li>Pricing</li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-3 w-36 max-lg:text-center">
                        <h1 className="font-semibold text-2xl ">Links</h1>
                        <ul className="list-none flex flex-col gap-1">
                            <li>Terms & Conditions</li>
                            <li>Refund Policy</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div className="flex flex-col  gap-3 max-lg:text-center">
                        <h1 className="font-semibold text-2xl">Contact</h1>
                        <ul className="list-none w-80 flex flex-col gap-1">
                            <li>+91 91368 95794</li>
                            <li>contactus@evoolfoundation.org</li>
                            <li>105, P-17, Omkar CHS Ltd, Noopur Nagar Mataji Mandir, Mira Road, Thane, Thane- 401107</li>
                        </ul>
                    </div>
                </div>

            </div>
            <div className="h-28 lg:bg-[#FAFAFA] flex flex-col lg:flex-row items-center lg:justify-between gap-5">
                <div className="pl-24 lg:flex hidden">
                    <h1>© 2025 Voolata. All rights reserved.</h1>
                </div>
                <div className="flex gap-6 items-center lg:pr-24 ">
                    <img src="/x_icon.svg" alt="" />
                    <img src="/ig_icon.svg" alt="" />
                    <img src="/meta_icon.svg" alt="" />
                </div>
                <div className="lg:hidden">
                    <h1>© 2025 Voolata. All rights reserved.</h1>
                </div>
            </div>
        </>
    )
}

export default Footer;