import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react'
// import { toast } from 'react-toastify';

const DonationPage = () => {

    const [donateData, setDonateData] = useState({
        name: "",
        email: "",
        phone: "",
        amount: "",
    });
    const [donateLoading, setDonateLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDonateLoading(true);
        const donationPayload = {
            name: donateData.name,
            email: donateData.email,
            phone: Number(donateData.phone),
            amount: Number(donateData.amount),
        }

        console.log(donationPayload);

        // try {
        //     // const data = await ;
        //     toast.success("User Registered!")
        //     // navigate("/dashboard");
        // } catch (error: any) {
        //     toast.error(error.response.data.message);
        // }
        setDonateLoading(false);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen space-y-8">
            <h1 className='text-4xl font-bold'>Donation Page</h1>
            <p className='text-xl'>Your small donation can help many lives</p>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                        name="name"
                        type="text"
                        value={donateData.name}
                        onChange={(e) => setDonateData({ ...donateData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-[350px] gap-2"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        name="email"
                        type="email"
                        value={donateData.email}
                        onChange={(e) => setDonateData({ ...donateData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-[350px] gap-2"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                        name="phone"
                        type="number"
                        value={donateData.phone}
                        onChange={(e) => setDonateData({ ...donateData, phone: e.target.value })}
                        placeholder="Enter your phone"
                        className="w-[350px] gap-2"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                        name="amount"
                        type="number"
                        value={donateData.amount}
                        onChange={(e) => setDonateData({ ...donateData, amount: e.target.value })}
                        placeholder="Enter amount"
                        className="w-[350px] gap-2"
                    />
                </div>
                <Button className="w-[350px]" type="submit" disabled={donateLoading}>{donateLoading ? "wait..." : "Pay"}</Button>
            </form>
        </div>
    )
}

export default DonationPage;