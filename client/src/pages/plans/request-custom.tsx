import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const RequestCustom = () => {

    const [requestData, setRequestData] = useState<{
        email: string;
        cards: number | null;
        amount: number | null;
        comment: string;
        period: string;
        interval: number | null;
    }>({
        email: "",
        cards: null,
        amount: null,
        comment: "",
        period: "",
        interval: null
    });
    const [requestLoading, setRequestLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRequestLoading(true);
        const { email, cards, amount, comment, period, interval } = requestData;
        if (!email || !cards || !amount || !comment || !period || !interval) {
            toast.warning("All fields are required");
            setRequestLoading(false);
            return;
        };
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/plan/request/custom`, requestData, { withCredentials: true });
            toast.success("Request Submitted!");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        setRequestLoading(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setRequestData(prevState => ({
            ...prevState,
            [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value
        }));
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-[#efe8fa] to-[#fcfafd]">
            <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-4 py-6">
                <div className="flex-1 lg:flex mt-4 gap-12">
                    <div className="lg:w-1/2 lg:pr-6 sm:px-4 mt-16">
                        <p className="mb-2 text-purple-600">Have Custom Needs</p>
                        <h3 className="mb-5 text-4xl font-bold">Get Custom Pricing</h3>
                        <p className="mb-12 text-lg text-gray-700">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, corrupti asperiores voluptatum labore eligendi quisquam. Id quae, laboriosam saepe facere ea asperiores!
                        </p>
                        <div className="mb-8 flex items-start space-x-4">
                            <div className="text-purple-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
                                </svg>
                            </div>
                            <div>
                                <p className="mb-1 font-semibold">Monthly 400k Image Downloads</p>
                                <p className="text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum porro molestias quaerat maxime modi.</p>
                            </div>
                        </div>
                        <div className="mb-8 flex items-start space-x-4">
                            <div className="text-purple-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            </div>
                            <div>
                                <p className="mb-1 font-semibold">Stay Synced to the Database</p>
                                <p className="text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum porro molestias quaerat maxime modi.</p>
                            </div>
                        </div>
                        <div className="mb-8 flex items-start space-x-4">
                            <div className="text-purple-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </div>
                            <div>
                                <p className="mb-1 font-semibold">Save on Energy Costs</p>
                                <p className="text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum porro molestias quaerat maxime modi.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 lg:w-1/2 lg:pl-6">
                        <div className="w-full px-8 py-10 mx-auto overflow-hidden bg-white shadow-2xl rounded-xl dark:bg-gray-900 lg:max-w-xl">
                            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">What do you want to ask</h1>

                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="flex-1 mt-6">
                                    <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Email address
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your Email"
                                        value={requestData.email}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-300 focus:ring-opacity-40 dark:focus:border-purple-300 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="flex-1 mt-6">
                                    <label htmlFor="cards" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Cards
                                    </label>
                                    <input
                                        name="cards"
                                        type="number"
                                        placeholder="Enter expected Cards"
                                        value={requestData.cards !== null ? requestData.cards : ''}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-300 focus:ring-opacity-40 dark:focus:border-purple-300 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="flex-1 mt-6">
                                    <label htmlFor="amount" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Amount
                                    </label>
                                    <input
                                        name="amount"
                                        type="number"
                                        placeholder="Enter expected price"
                                        value={requestData.amount !== null ? requestData.amount : ''}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-300 focus:ring-opacity-40 dark:focus:border-purple-300 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="flex-1 mt-6">
                                    <label htmlFor="period" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Period
                                    </label>
                                    <select
                                        name="period"
                                        value={requestData.period}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-300 focus:ring-opacity-40 dark:focus:border-purple-300 focus:outline-none focus:ring"
                                    >
                                        <option className="text-gray-700 px-5 py-3" value="">Select period of Billing</option>
                                        <option className="text-gray-700 px-5 py-3" value="daily">Daily</option>
                                        <option className="text-gray-700 px-5 py-3" value="weekly">Weekly</option>
                                        <option className="text-gray-700 px-5 py-3" value="monthly">Monthly</option>
                                        <option className="text-gray-700 px-5 py-3" value="yearly">Yearly</option>
                                    </select>
                                </div>

                                <div className="flex-1 mt-6">
                                    <label htmlFor="interval" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Interval
                                    </label>
                                    <input
                                        name="interval"
                                        type="number"
                                        placeholder="Enter expected Interval Of Billing"
                                        value={requestData.interval !== null ? requestData.interval : ''}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-300 focus:ring-opacity-40 dark:focus:border-purple-300 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div className="w-full mt-6">
                                    <label htmlFor="comment" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Message
                                    </label>
                                    <textarea
                                        name="comment"
                                        placeholder="Any Other Details"
                                        value={requestData.comment}
                                        onChange={handleChange}
                                        className="block w-full h-20 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-20 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-300 focus:ring-opacity-40 dark:focus:border-purple-300 focus:outline-none focus:ring"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={requestLoading}
                                    className="w-full px-6 py-3 mt-6 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-600 rounded-md hover:bg-purple-500 focus:outline-none focus:ring focus:ring-purple-400 focus:ring-opacity-50"
                                >
                                    {requestLoading ? "Hold on..." : "Submit Request"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RequestCustom;