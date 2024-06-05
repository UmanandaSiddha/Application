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
        <div>
        <h1>Report</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="Enter your Email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value})}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Name</label>
                <input
                    name="name"
                    type="text"
                    placeholder="Enter your Name"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value})}
                    required
                />
            </div>
            <div>
                <label htmlFor="comment">Message</label>
                <textarea
                    name="message"
                    placeholder="Enter your Message"
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value})}
                    required
                />
            </div>
            <button type="submit" disabled={contactLoading}>{contactLoading ? "Hold on..." : "Submit"}</button>
        </form>
    </div>
    )
}

export default ReportPage;