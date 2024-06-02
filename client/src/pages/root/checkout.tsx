import React from "react";

const Checkout = () => {
  return (
    <>
      <div className="w-full max-h-screen">
        <div className="flex justify-center font-Philosopher font-bold text-2xl py-2">
          Complete your payment
        </div>
        <div className="flex justify-center">
          <hr className="border-b-1 w-[90%] lg:w-[80%] border-slate-700" />
        </div>

        <div className="lg:hidden block">
          {/* Plan Summary */}
          <div className="py-4 bg-slate-200">
            <div className="font-Philosopher text-lg flex justify-center underline">
              Plan Summary
            </div>
            <div className="flex flex-row font-Philosopher">
              <p className="basis-1/2 font-bold flex justify-center">
                Your Plan:
              </p>
              <p className="basis-1/2 flex justify-start">Plan Name</p>
            </div>
            <div className="font-Philosopher flex flex-row">
              <p className="basis-1/2 font-bold flex justify-center">
                Vcards Allowed:
              </p>
              <p className="basis-1/2 flex justify-start">50</p>
            </div>
            <div className="flex justify-center">
              <hr className="border-1 w-[80%] border-slate-700 my-2" />
            </div>
            <div className="flex flex-row">
              <div className="basis-1/2 flex justify-start pl-[3rem]">
                Subtotal:
              </div>
              <div className="basis-1/2 flex justify-end pr-[3rem] font-bold">
                Rs. 200
              </div>
            </div>
            <div className="flex flex-row">
              <div className="basis-1/2 flex justify-start pl-[3rem]">
                Discount (if applied):
              </div>
              <div className="basis-1/2 flex justify-end pr-[3rem] font-bold">
                - Rs. 0
              </div>
            </div>
            <div className="flex justify-center">
              <hr className="border-1 w-[80%] border-slate-700 my-2" />
            </div>
            <div className="flex flex-row">
              <div className="basis-1/2 flex justify-start pl-[3rem] items-end">
                Total Amount:
              </div>
              <div className="basis-1/2 flex flex-row">
                <div className="basis-1/3 flex justify-end items-end pr-[0.5rem] font-Philosopher text-lg">
                  INR
                </div>
                <div className="basis-2/3 text-3xl font-bold font-Philosopher flex justify-start pr-[2rem]">
                  Rs. 200
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <hr className="border-1 w-full border-slate-700" />
          </div>

          <div className="">
            {/* Personal Information */}
            <div className="">
              <div className="pl-[3rem] font-Philosopher mt-[1rem] text-xl">
                Personal Information
              </div>
              <div className="text-sm text-slate-400 pl-[3rem]">
                Your information is secure and encrypted.
              </div>
              <div className="flex justify-center">
                <div className="w-[90%] mt-4">
                  <form
                    action=""
                    className="py-[2rem] border-2 border-slate-300 rounded-lg"
                  >
                    <div className="w-[95%]">
                      <div className="flex flex-row mb-2">
                        <div className="basis-1/3 flex justify-center items-center font-Philosopher text-slate-600">
                          <label htmlFor="name">Name:</label>
                        </div>
                        <div className="basis-2/3 w-full">
                          <input
                            type="text"
                            className="border-2 border-slate-300 py-2 pl-2 w-full text-sm rounded-sm"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row my-2">
                        <div className="basis-1/3 flex justify-center items-center font-Philosopher text-slate-600">
                          <label htmlFor="email">Email:</label>
                        </div>
                        <div className="basis-2/3">
                          <input
                            type="text"
                            placeholder="Enter your email"
                            className="w-full rounded-sm border-2 text-sm border-slate-300 py-2 pl-2"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row my-2">
                        <div className="basis-1/3 flex justify-center items-center font-Philosopher text-slate-600">
                          <label htmlFor="email">Phone:</label>
                        </div>
                        <div className="basis-2/3">
                          <input
                            type="text"
                            placeholder="Enter phone number"
                            className="w-full rounded-sm border-2 text-sm border-slate-300 py-2 px-4 pl-2"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* Payment */}
            <div className="">
              <div className="pl-[3rem] font-Philosopher mt-[1rem] text-xl font-bold">
                Payment
              </div>
              <div className="text-sm text-slate-400 pl-[3rem]">
                All transactions are secure and encrypted.
              </div>
              <div className="flex justify-center mt-2">
                <div className="w-[90%] border-1 border-slate-500 shadow-lg py-2 rounded-md">
                  <div className="pl-[2rem] pt-[1rem]">
                    <img
                      src="./image.webp"
                      className=""
                      width={110}
                      height={110}
                      alt=""
                    />
                  </div>
                  <div className="text-[11px] pl-[2rem] pt-[1rem]">
                    After clicking “ Complete Order ”, you will be redirected to
                    Razorpay (Cards, UPI, NetBanking, Wallets) to complete your
                    purchase securely.
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-4">
                <div className="w-[90%]">
                  <button
                    type="button"
                    className="w-full py-3 font-Philosopher text-xl bg-blue-500 text-white font-bold hover:bg-blue-400 hover:cursor-pointer rounded-lg"
                  >
                    Complete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* for pc screens */}
        <div className="flex justify-center">
          <div className="lg:flex lg:flex-row hidden lg:w-[80%]">
            <div className="lg:basis-3/5">
              {/* Personal Information */}
              <div className="">
                <div className="pl-[3rem] font-Philosopher mt-[1rem] text-xl">
                  Personal Information
                </div>
                <div className="text-sm text-slate-400 pl-[3rem]">
                  Your information is secure and encrypted.
                </div>
                <div className="flex justify-center">
                  <div className="w-[90%] mt-4">
                    <form
                      action=""
                      className="py-[2rem] border-2 border-slate-300 rounded-lg"
                    >
                      <div className="w-[95%]">
                        <div className="flex flex-row mb-2">
                          <div className="basis-1/3 flex justify-center items-center font-Philosopher text-slate-600">
                            <label htmlFor="name">Name:</label>
                          </div>
                          <div className="basis-2/3 w-full">
                            <input
                              type="text"
                              className="border-2 border-slate-300 py-2 pl-2 w-full text-sm rounded-sm"
                              placeholder="Enter your name"
                            />
                          </div>
                        </div>
                        <div className="flex flex-row my-2">
                          <div className="basis-1/3 flex justify-center items-center font-Philosopher text-slate-600">
                            <label htmlFor="email">Email:</label>
                          </div>
                          <div className="basis-2/3">
                            <input
                              type="text"
                              placeholder="Enter your email"
                              className="w-full rounded-sm border-2 text-sm border-slate-300 py-2 pl-2"
                            />
                          </div>
                        </div>
                        <div className="flex flex-row my-2">
                          <div className="basis-1/3 flex justify-center items-center font-Philosopher text-slate-600">
                            <label htmlFor="email">Phone:</label>
                          </div>
                          <div className="basis-2/3">
                            <input
                              type="text"
                              placeholder="Enter phone number"
                              className="w-full rounded-sm border-2 text-sm border-slate-300 py-2 px-4 pl-2"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* Payment */}
              <div className="">
                <div className="pl-[3rem] font-Philosopher mt-[1rem] text-xl font-bold">
                  Payment
                </div>
                <div className="text-sm text-slate-400 pl-[3rem]">
                  All transactions are secure and encrypted.
                </div>
                <div className="flex justify-center mt-2">
                  <div className="w-[90%] border-1 border-slate-500 shadow-lg py-2 rounded-md">
                    <div className="pl-[2rem] pt-[1rem]">
                      <img
                        src="./image.webp"
                        className=""
                        width={110}
                        height={110}
                        alt=""
                      />
                    </div>
                    <div className="text-[11px] pl-[2rem] pt-[1rem]">
                      After clicking “ Complete Order ”, you will be redirected
                      to Razorpay (Cards, UPI, NetBanking, Wallets) to complete
                      your purchase securely.
                    </div>
                  </div>
                </div>
                <div className="flex justify-center my-4">
                  <div className="w-[90%]">
                    <button
                      type="button"
                      className="w-full py-3 font-Philosopher text-xl bg-blue-500 text-white font-bold hover:bg-blue-400 hover:cursor-pointer rounded-lg"
                    >
                      Complete Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Plan Summary */}
            <div className="py-4 bg-slate-200 lg:basis-2/5">
              <div className="font-Philosopher text-lg flex justify-center underline mb-[1.5rem]">
                Plan Summary
              </div>
              <div className="flex flex-row font-Philosopher">
                <p className="basis-1/2 font-bold flex justify-center">
                  Your Plan:
                </p>
                <p className="basis-1/2 flex justify-start">Plan Name</p>
              </div>
              <div className="font-Philosopher flex flex-row">
                <p className="basis-1/2 font-bold flex justify-center">
                  Vcards Allowed:
                </p>
                <p className="basis-1/2 flex justify-start">50</p>
              </div>
              <div className="flex justify-center">
                <hr className="border-1 w-[80%] border-slate-700 my-2" />
              </div>
              <div className="flex flex-row">
                <div className="basis-1/2 flex justify-start pl-[3rem]">
                  Subtotal:
                </div>
                <div className="basis-1/2 flex justify-end pr-[3rem] font-bold">
                  Rs. 200
                </div>
              </div>
              <div className="flex flex-row">
                <div className="basis-1/2 flex justify-start pl-[3rem]">
                  Discount (if applied):
                </div>
                <div className="basis-1/2 flex justify-end pr-[3rem] font-bold">
                  - Rs. 0
                </div>
              </div>
              <div className="flex justify-center">
                <hr className="border-1 w-[80%] border-slate-700 my-2" />
              </div>
              <div className="flex flex-row mt-[1rem]">
                <div className="basis-1/2 flex justify-start pl-[3rem] items-end">
                  Total Amount:
                </div>
                <div className="basis-1/2 flex flex-row">
                  <div className="basis-1/3 flex justify-end items-end pr-[0.5rem] font-Philosopher text-lg">
                    INR
                  </div>
                  <div className="basis-2/3 text-3xl font-bold font-Philosopher flex justify-start pr-[2rem]">
                    Rs. 200
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-[2rem]">
                <hr className="border-1 w-[80%] border-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex justify-center my-[1rem]">
          <hr className="border-1 w-full border-slate-700" />
        </div> */}
      </div>
    </>
  );
};

export default Checkout;
