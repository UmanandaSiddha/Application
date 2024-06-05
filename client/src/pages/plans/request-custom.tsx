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
        <div>
            <h1>Request you Plan Here</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter your Email"
                        value={requestData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="cards">Cards</label>
                    <input
                        name="cards"
                        type="number"
                        placeholder="Enter expected Cards"
                        value={requestData.cards !== null ? requestData.cards : ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount">Amount</label>
                    <input
                        name="amount"
                        type="number"
                        placeholder="Enter expected price"
                        value={requestData.amount !== null ? requestData.amount : ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="period">Period</label>
                    <select
                        name="period"
                        value={requestData.period}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select period of Billing</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="interval">Interval</label>
                    <input
                        name="interval"
                        type="number"
                        placeholder="Enter expected Interval Of Billing"
                        value={requestData.interval !== null ? requestData.interval : ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="comment">Comment</label>
                    <textarea
                        name="comment"
                        placeholder="Any Other Details"
                        value={requestData.comment}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={requestLoading}>{requestLoading ? "Hold on..." : "Submit Request"}</button>
            </form>
        </div>
    )
}

export default RequestCustom;