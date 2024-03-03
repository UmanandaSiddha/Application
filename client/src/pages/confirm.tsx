import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2 } from "lucide-react";

const Confirm = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const order_id = search.get("order_id");
    const pay_id = search.get("pay_id");

    const [valueObtained, setValueObtained] = useState(false);

    useEffect(() => {
        if ( pay_id && order_id ){
            const pollInterval = setInterval(() => {
                axios.get(`${import.meta.env.VITE_BASE_URL}/user/me`, { withCredentials: true })
                    .then(response => {
                        console.log(response)
                        if (response.data.user.currentPlan.planStatus === "succeeded") {
                            setValueObtained(true);
                            clearInterval(pollInterval);
                            navigate('/dashboard');
                            toast.success(`Payment Successful`);
                        }
                    })
                    .catch(error => console.error('Error occurred during polling:', error));
            }, 5000);
    
            return () => clearInterval(pollInterval);
        } else {
            navigate(-1);
        }
    }, []);

    return (
        <div className='flex flex-col justify-center gap-4 items-center mt-8'>
            <p className='text-2xl font-semibold'>Order Id: {order_id}</p>
            <p className='text-2xl font-semibold'>Payment Id: {pay_id}</p>
            <p className='text-2xl font-semibold text-red-600'>Do not refresh this page</p>
            {valueObtained ? (
                <p className='text-2xl font-semibold'>Payment Confirmed</p>
            ) : (
                <div className='flex gap-2'>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <p className='text-2xl font-semibold'>Waiting for confirmation...</p>
                </div>
            )}
        </div>
    )
}

export default Confirm;