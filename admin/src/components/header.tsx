import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Popover } from '@headlessui/react'
import axios from 'axios';
import { userNotExist } from '../redux/reducer/userReducer';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User } from '../types/types';

interface PropsType {
    user: User | null;
}

const Header = ({ user }: PropsType) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, { withCredentials: true });
            dispatch(userNotExist());
            toast.success("User Logged Out Successfully");
            navigate("/");
            setMobileMenuOpen(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    return (
        <header className="bg-white">
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
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    <Link to='/dashboard' className="text-sm font-semibold leading-6 text-gray-900">
                        Dashboard
                    </Link>
                    <Link to='/plans' className="text-sm font-semibold leading-6 text-gray-900">
                        Subcription
                    </Link>
                    <Link to='/profile' className="text-sm font-semibold leading-6 text-gray-900">
                        Profile
                    </Link>

                </Popover.Group>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {
                        user ? (
                            <div className="flex items-center gap-5">
                                <p className="hidden sm:block">{user.name}</p>
                                <button className='px-4 py-2 bg-black rounded-md text-white text-sm' onClick={logout}>Log Out</button>
                            </div>
                        ) : (
                            <div>
                                <button className='px-4 py-2 bg-black rounded-md text-white text-sm'><Link to="/login">Login</Link></button>
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
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link
                                    to='/dashboard'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to='/plans'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Subscription
                                </Link>
                                <Link
                                    to='/profile'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Profile
                                </Link>
                            </div>
                            <div className="py-6">
                                {
                                    user ? (
                                        <div className="flex items-center gap-5">
                                            <p>{user.name}</p>
                                            <button onClick={logout}>Logout</button>
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

export default Header;