import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";

function loadScript(src: any) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const Subscription = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [plans, setPlans] = useState<any>([]);

  useEffect(() => {
    const getPlans = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/plan/all`,
          { withCredentials: true }
        );
        setPlans(data.plans);
      } catch (error) {
        console.log(error);
      }
    };
    getPlans();
  }, []);

  const handlePayment = async (id: string) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const { data }: { data: any } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/sub/new`,
        { id },
        config
      );
      if (!data) {
        toast.error("Failed to Execute Payment");
      }
      const options = {
        key: data.key,
        amount: 100,
        currency: "INR",
        name: "VCards App",
        description: "just fine",
        subscription_id: data.subscriptions_id,
        handler: async function (response: any) {
          const {
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature,
          } = response;
          const captureData = {
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature,
          };
          console.log(captureData);
          const { data }: { data: any } = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/sub/capture`,
            captureData,
            config
          );
          console.log(data);
        },
        prefill: {
          email: user?.email,
        },
        timeout: 120,
        readonly: {
          email: user?.email,
          name: user?.name,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razor = new (window as any).Razorpay(options);
      razor.on("payment.failed", function (response: any) {
        console.log(response.error.description);
        console.log(response.error.metadata.order_id);
        console.log(response.error.metadata.payment_id);
        toast.info(response.error.description);
      });
      razor.open();
      console.log("clicked");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold">Subscription</h1>
      <div className="w-full flex justify-center">
        <div className="pt-4 w-full flex justify-center">
          {plans.map((plan: any, index: number) => (
            <div
              className="border-2 border-blue-500 shadow-xl p-2 py-4 rounded-xl w-[90%]"
              key={index}
            >
              <div className="flex flex-row py-4">
                <div className="basis-1/2 flex justify-end font-Kanit ">
                  <div className="">
                    <p className="text-2xl font-bold">{plan?.name}</p>
                    <div className="">
                      <p className="text-blue-400 bg-blue-200 px-1 py-1 rounded-md">
                        Plan Validity: 30 Days
                      </p>
                    </div>
                  </div>
                </div>
                <div className="basis-1/2">
                  <div className="">
                    <div className="font-Kanit text-lg flex justify-end pr-4 text-slate-400">
                      Price
                    </div>
                    <div className="font-Kanit text-xl flex justify-end pr-4 text-black">
                      Rs.200
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row font-Kanit pl-3">
                <div className="basis-2/5 flex justify-start pl-2">
                  Plan ID:
                </div>
                <div className="basis-3/5 flex justify-start pl-2">
                  {plan?.razorPlanId}
                </div>
              </div>
              <div className="flex flex-row font-Kanit pl-3">
                <div className="basis-2/5 flex justify-start pl-2">
                  VCards Allowed:
                </div>
                <div className="basis-3/5 flex justify-start pl-2">
                  {plan?.cards}
                </div>
              </div>
              <div className="flex flex-row font-Kanit pl-3">
                <div className="basis-2/5 flex justify-start pl-2">Period:</div>
                <div className="basis-3/5 flex justify-start pl-2">
                  {plan?.period}
                </div>
              </div>
              <div className="w-full py-3 flex justify-center">
                <button
                  className="w-[90%] py-2 bg-blue-500 text-white rounded-sm font-Kanit hover:cursor-pointer hover:bg-blue-400"
                  onClick={() => handlePayment(plan?.razorPlanId)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
