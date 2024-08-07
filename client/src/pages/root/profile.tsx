import axios from "axios";
import { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { toast } from "react-toastify";

const Profile = () => {

    const [contactData, setContactData] = useState({
        email: "",
        name: "",
        message: "",
    });
    const [contactLoading, setContactLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setContactLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/contact/con/new`, contactData, { withCredentials: true });
            toast.success("Request Submitted!");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        setContactLoading(false);
    }

    return (
        <div className="w-[80%] mx-auto">
            <div className="flex justify-center items-center gap-6">
                <div className="sidebar basis-1/4 hidden lg:block">
                    <div
                        className="flex w-full min-h-[80vh] px-8 py-4 mt-4 bg-white rounded-lg shadow-lg"
                    >
                        <div className="flex w-full flex-col justify-between mt-6">
                            <nav className="flex flex-col justify-center gap-4">
                                <h1 className="mx-4 text-2xl font-bold capitalize">Welcome John</h1>

                                <hr className="my-2 border-gray-400 " />

                                <a
                                    className="flex items-center px-4 py-2 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                    href=""
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                    </svg>
                                    <span className="mx-4 font-medium">Dashboard</span>
                                </a>
                                <a
                                    className="flex items-center px-4 py-2 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                    href=""
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                                    </svg>
                                    <span className="mx-4 font-medium">Billing</span>
                                </a>
                                <a
                                    className="flex items-center px-4 py-2 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                    href=""
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                                    </svg>
                                    <span className="mx-4 font-medium">Report</span>
                                </a>
                                <a
                                    className="flex items-center px-4 py-2 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                    href=""
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" stroke="currentColor">
                                        <path d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="mx-4 font-medium">Donate</span>
                                </a>
                            </nav>
                            <button onClick={() => { }} className='flex justify-center items-center gap-4 px-4 py-2 bg-black hover:bg-gray-700 rounded-md'>
                                <p className="text-white text-md">Log Out</p>
                                <span><IoIosLogOut className="object-cover text-white mx-2 rounded-full h-5 w-5" /></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="main basis-full md:basis-3/4 my-4">
                    <div className="w-full px-8 py-4 mt-20 lg:mt-2 bg-white rounded-lg shadow-lg">
                        <div className="flex -mt-16 justify-end">
                            <img
                                className="object-cover w-20 h-20 border-4 border-blue-400 rounded-full"
                                alt="Testimonial avatar"
                                src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                            />
                        </div>
                        <h2 className="mt-2 text-xl font-semibold text-gray-800 md:mt-0">
                            John Doe
                        </h2>
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <p className="mt-2 text-sm text-gray-600">john23@gmail.com</p>
                                <p className="mt-2 text-sm text-gray-600">789456</p>
                            </div>
                            <button className="border-2 border-gray-500 text-md text-gray-500 bg-white px-3 py-2 rounded-lg">Edit Profile</button>
                        </div>
                    </div>
                    <div className="w-full px-8 py-4 mt-4 bg-white rounded-lg shadow-lg">
                        <h1 className="text-lg font-semibold">Privacy Settings</h1>
                        <button className="mt-2 border-2 border-gray-500 text-md text-gray-500 bg-white px-3 py-2 rounded-lg">Reset Password</button>
                    </div>
                    <div className="w-full px-8 py-4 mt-4 bg-white rounded-lg shadow-lg">
                        <h1 className="text-lg font-semibold">Account Actions</h1>
                        <p className="mt-2 text-gray-500 italic">Lorem ipsum dolor sit amet consectetur.</p>
                        <button className="mt-2 border-2 border-red-500 text-center px-3 py-2 rounded-lg text-white bg-red-500">Deactivate Account</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;