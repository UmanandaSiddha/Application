import { useEffect, useState } from 'react'
import { RiMenu3Line, RiMoneyRupeeCircleLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RootState } from "../../redux/store";
import { toast } from 'react-toastify'
import { userNotExist } from "../../redux/reducer/userReducer";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { RxDashboard } from 'react-icons/rx';
import { BiDonateHeart } from 'react-icons/bi';
import { FiPhone } from 'react-icons/fi';
import { LuScrollText } from 'react-icons/lu';
import { IoHomeOutline, IoWalletOutline } from 'react-icons/io5';

export default function Header() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const logout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, { withCredentials: true });
            dispatch(userNotExist());
            toast.success("User Logged Out Successfully");
            navigate("/login");
            if (mobileMenuOpen === true) setMobileMenuOpen(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [mobileMenuOpen]);

    return (
        <header className="bg-white fixed top-0 left-0 right-0 z-50 h-16 md:h-18">
            <nav className="mx-auto w-full md:w-[80%] flex items-center justify-between px-6 py-4">
                <Link to='/'>
                    <img className="h-8 w-auto" src="/voolata_long_r.png" alt="" />
                </Link>
                <div className="hidden lg:flex lg:gap-x-12">
                    <Link to='/' className="text-md font-semibold leading-6">
                        Home
                    </Link>
                    <Link to='/donation' className="text-md font-semibold leading-6">
                        Donate
                    </Link>
                    <Link to='/plans' className="text-md font-semibold leading-6">
                        Pricing
                    </Link>
                    <Link to='/about-us' className="text-md font-semibold leading-6">
                        About Us
                    </Link>
                    <Link to='/contact' className="text-md font-semibold leading-6">
                        Contact
                    </Link>
                </div>

                <div className="lg:hidden">
                    {user ? (
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md text-gray-700"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <RiMenu3Line className="h-6 w-6" aria-hidden="true" />
                        </button>
                    ) : (
                        <button className='font-semibold text-md'>
                            <Link to="/login">Login</Link>
                        </button>
                    )}
                </div>

                <div className="hidden lg:block">
                    {user ? (
                        <div onClick={() => navigate("/profile")} className="flex items-center gap-3">
                            <p className="hidden cursor-pointer sm:block text-md">{user.name.split(" ")[0]}</p>
                            {user.image ? (
                                <img src={user.image} className='h-8 w-8 rounded-full' alt="avatar" />
                            ) : (
                                <div className='h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center'>
                                    <p className='text-sm font-semibold text-black'>{user.name[0].toUpperCase()}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className='font-semibol text-md'>
                            <Link to="/login">Login</Link>
                        </button>
                    )}
                </div>
            </nav>

            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="hide-scrollbar h-screen lg:hidden fixed inset-0 bg-opacity-30 backdrop-blur z-10"
                >
                    <aside className="flex flex-col w-64 h-screen px-6 py-4 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l">
                        <Link to='/'>
                            <img className="h-8" src="/voolata_long_r.png" alt="" />
                        </Link>

                        <div className="flex flex-col flex-grow justify-between mt-1">
                            <nav>
                                <hr className="my-2 border-gray-200" />
                                <Link to="/" className={`flex items-center p-2 mt-5 rounded-md ${location.pathname === "/" ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                    <IoHomeOutline className='h-5 w-5' />
                                    <span className="mx-4 font-medium">Home</span>
                                </Link>
                                <Link to="/about-us" className={`flex items-center p-2 mt-5 rounded-md ${location.pathname === "/about-us" ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                    <LuScrollText className='h-5 w-5' />
                                    <span className="mx-4 font-medium">About Us</span>
                                </Link>
                                {user && (
                                    <Link to="/dashboard/botanical" className={`flex items-center p-2 mt-5 rounded-md ${["/dashboard/botanical", "/dashboard/animal", "/dashboard/creator", "/dashboard/individual", "/dashboard/medical"].includes(location.pathname) ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                        <RxDashboard className='h-5 w-5' />
                                        <span className="mx-4 font-medium">Dashboard</span>
                                    </Link>
                                )}
                                <Link to="/donation" className={`flex items-center p-2 mt-5 rounded-md ${location.pathname === "/donation" ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                    <BiDonateHeart className='h-5 w-5' />
                                    <span className="mx-4 font-medium">Donate</span>
                                </Link>
                                {user && (
                                    <Link to="/billing" className={`flex items-center p-2 mt-5 rounded-md ${location.pathname === "/billing" ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                        <IoWalletOutline className='h-5 w-5' />
                                        <span className="mx-4 font-medium">Billing</span>
                                    </Link>
                                )}
                                <Link to="/plans" className={`flex items-center p-2 mt-5 rounded-md ${location.pathname === "/plans" ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                    <RiMoneyRupeeCircleLine className='h-5 w-5' />
                                    <span className="mx-4 font-medium">Pricing</span>
                                </Link>
                                <Link to="/contact" className={`flex items-center p-2 mt-5 rounded-md ${location.pathname === "/contact" ? "text-gray-700 bg-gray-100" : "text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700"}`}>
                                    <FiPhone className='h-5 w-5' />
                                    <span className="mx-4 font-medium">Contact</span>
                                </Link>
                            </nav>

                            <div className="pb-10">
                                {user ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Link to="/profile" className='flex items-center'>
                                            {user.image ? (
                                                <img src={user.image} className='h-10 w-10 rounded-full' alt="avatar" />
                                            ) : (
                                                <div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center'>
                                                    <p className='text-xl font-semibold text-black'>{user.name[0].toUpperCase()}</p>
                                                </div>
                                            )}
                                            <span className="mx-2 font-medium text-gray-800">{user.name}</span>
                                        </Link>
                                        <IoIosLogOut onClick={logout} className="object-cover mx-2 rounded-full h-6 w-6" />
                                    </div>
                                ) : (
                                    <Link to="/login" className="flex items-center px-4 py-2 rounded-md bg-gray-800 text-gray-200">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </header>
    )
}