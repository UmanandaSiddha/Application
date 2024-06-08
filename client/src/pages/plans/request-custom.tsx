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
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/plan/request`, requestData, { withCredentials: true });
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-semibold text-center mb-4">Request Your Plan Here</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your Email"
                            value={requestData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="cards" className="block text-sm font-medium text-gray-700">Cards</label>
                        <input
                            name="cards"
                            type="number"
                            placeholder="Enter expected Cards"
                            value={requestData.cards !== null ? requestData.cards : ''}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            name="amount"
                            type="number"
                            placeholder="Enter expected price"
                            value={requestData.amount !== null ? requestData.amount : ''}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="period" className="block text-sm font-medium text-gray-700">Period</label>
                        <select
                            name="period"
                            value={requestData.period}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select period of Billing</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="interval" className="block text-sm font-medium text-gray-700">Interval</label>
                        <input
                            name="interval"
                            type="number"
                            placeholder="Enter expected Interval Of Billing"
                            value={requestData.interval !== null ? requestData.interval : ''}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                        <textarea
                            name="comment"
                            placeholder="Any Other Details"
                            value={requestData.comment}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={requestLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        {requestLoading ? "Hold on..." : "Submit Request"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RequestCustom;