import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const ReportPage = () => {

    const [contactData, setContactData] = useState({
        email: "",
        name: "",
        message: "",
    });
    const [contactLoading, setContactLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setContactLoading(true);
        const payload = {
            ...contactData,
            report: true
        }
        console.log(payload);
        // try {
        //     await axios.post(`${import.meta.env.VITE_BASE_URL}/not made`, contactData, { withCredentials: true });
        //     toast.success("Request Submitted!");
        // } catch (error: any) {
        //     console.log(error);
        //     toast.error(error.response.data.message);
        // }
        setContactLoading(false);
    }

    return (
        <div className="bg-gray-100 h-screen w-screen mt-0 flex lg:items-center">
            <div className="lg:w-[40%] w-full mx-auto p-6 bg-white rounded-lg shadow-md sm:p-8">
                <h1 className="text-2xl font-bold mb-6 text-center sm:text-3xl">
                    Report
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your Email"
                            value={contactData.email}
                            onChange={(e) =>
                                setContactData({ ...contactData, email: e.target.value })
                            }
                            required
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Enter your Name"
                            value={contactData.name}
                            onChange={(e) =>
                                setContactData({ ...contactData, name: e.target.value })
                            }
                            required
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block font-medium text-gray-700">
                            Message
                        </label>
                        <textarea
                            name="message"
                            placeholder="Enter your Message"
                            value={contactData.message}
                            onChange={(e) =>
                                setContactData({ ...contactData, message: e.target.value })
                            }
                            required
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={contactLoading}
                        className={`w-full px-6 py-3 font-medium text-white rounded-md ${contactLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {contactLoading ? "Hold on..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ReportPage;