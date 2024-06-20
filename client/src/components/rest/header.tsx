import {  useState } from 'react'
import { Dialog, Popover } from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

import { Link,  NavLink,  useNavigate } from 'react-router-dom'
import { RootState } from "../../redux/store";
import { toast } from 'react-toastify'
import { userNotExist } from "../../redux/reducer/userReducer";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

export default function Header() {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(
        (state: RootState) => state.userReducer
    );
    
    const logout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, { withCredentials: true } );
            dispatch(userNotExist());
            toast.success("User Logged Out Successfully");
            navigate("/login");
            setMobileMenuOpen(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="bg-black text-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to='/' className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                </div>
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    <NavLink to='/dashboard' className="text-base font-semibold leading-6 text-white font-Kanit">
                        Dashboard
                    </NavLink>
                    <Link to='/plans' className="text-base font-semibold leading-6 text-white font-Kanit">
                        Pricing
                    </Link>
                    <Link to='/billing' className="text-base font-semibold leading-6 text-white font-Kanit">
                        Billing
                    </Link>
                    <Link to='/profile' className="text-base font-semibold leading-6 text-white font-Kanit">
                        Profile
                    </Link>

                </Popover.Group>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {
                        user ? (
                            <div className="flex items-center gap-5">
                                <p className="hidden sm:block font-Philosopher text-lg">{user.name}</p>
                                <button className='px-4 py-2 bg-white rounded-md text-black text-sm font-Kanit' onClick={logout}>Log Out</button>
                            </div>
                        ) : (
                            <div>
                                <button className='px-4 py-2 bg-white rounded-md text-black text-sm font-Kanit'><Link to="/login">Login</Link></button>
                            </div>
                        )
                    }
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                alt=""
                            />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root ">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link
                                    to='/dashboard'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 rounded-lg px-3 py-2 text-lg font-semibold flex font-Philosopher justify-center leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to='/plans'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 rounded-lg px-3 py-2 text-lg flex font-Philosopher justify-center font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Pricing
                                </Link>
                                <Link
                                    to='/billing'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 rounded-lg px-3 py-2 text-lg flex font-Philosopher justify-center font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Billing
                                </Link>
                                <Link
                                    to='/profile'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 rounded-lg px-3 py-2 text-lg flex font-Philosopher justify-center font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Profile
                                </Link>
                            </div>
                            <div className="py-6">
                                {
                                    user ? (
                                        <div className="flex flxe-row items-center gap-5">
                                            <div className="basis-1/2 flex justify-center">
                                                <p className='font-Philosopher text-xl'>{user.name}</p>
                                            </div>
                                            <div className="basis-1/2 flex justify-center">
                                                <button onClick={logout} className='bg-black text-white font-Philosopher px-8 py-2 rounded-lg hover:cursor-pointer'>Logout</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <Link onClick={() => setMobileMenuOpen(false)} to="/login">Login</Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    )
}
