import { PlansCard } from '@/components/rest/plans-card';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const plans = [
    {
        name: "Diamond Plan",
        validity: 30,
        price: 200
    },
    {
        name: "Premium Plan",
        validity: 60,
        price: 400
    },
]

const Plans = () => {

    const { isPaid, user } = useSelector(
        (state: RootState) => state.userReducer
    );

    return (
        <div>
            {user?.isVerified ? (
                <>
                    {isPaid ? (
                        <div className='flex flex-col justify-center gap-6 items-center mt-8'>
                            <h1 className='text-3xl font-semibold'>Current Plan</h1>
                            <div className='flex gap-6'>
                                <PlansCard plan={user.currentPlan} />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='flex flex-col justify-center gap-6 items-center mt-8'>
                                <h1 className='text-3xl font-semibold'>Available Plans</h1>
                                <div className='flex flex-wrap justify-center gap-6'>
                                    {plans.map((plan, index) => (
                                        <PlansCard key={index} plan={plan} />
                                    ))}
                                </div>
                                <div className='flex flex-wrap justify-center gap-5'>
                                    <div className='flex flex-col'>
                                        <h1 className='text-2xl text-center'>Test UPI</h1>
                                        <p>Success UPI : success@razorpay</p>
                                        <p>Failure UPi : failure@razorpay</p>
                                    </div>
                                    <div className='flex flex-col'>
                                        <h1 className='text-2xl text-center'>Test Cards</h1>
                                        <p>Mastercard(Domestic) : 5267 3181 8797 5449</p>
                                        <p>Visa(Domestic) : 4111 1111 1111 1111</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <p>You are not verified</p>
            )}
        </div>
    )
}

export default Plans;