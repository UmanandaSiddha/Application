import { useNavigate } from "react-router-dom"


const onboarding = () => {
  const navigate = useNavigate();
  return (
    <>
    <div className="lg:w-full lg:mt-[3rem] md:w-full md:mt-[3rem]">
        <div className="lg:flex lg:justify-center md:flex md:justify-center lg:flex-col lg:items-center lg:text-3xl lg:mt-[4rem] p-4">
            <p className="font-Philosopher text-2xl font-bold">
                Who are you?
            </p>
            <p className="font-Kanit text-base leading-tight text-slate-500">
              To assist you in streamlining the process for achieving your objective
            </p>
        </div>
        <div className="lg:flex lg:flex-col lg:w-full lg:gap-4 lg:mt-[2rem] w-full">
          <div className=" lg:flex lg:justify-center flex justify-center w-full mt-4 lg:mt-2">
          <button className="bg-blue-200 lg:hover:bg-blue-300 sm:text-black  text-blue-800 font-bold font-Philosopher px-[6.5rem] py-4 rounded-lg text-xl" onClick={() => {
            navigate("/register");
          }}>
            I am an Individual
          </button>
          </div>
          <div className=" lg:flex lg:justify-center my-4 flex justify-center w-full">
          <button className="bg-blue-200 lg:hover:bg-blue-300 text-blue-800 font-bold font-Philosopher px-[5.7rem] py-4 rounded-lg text-xl" onClick={() => {
            navigate("/organization/register")
          }}>
            I am an Organisation
          </button>
          </div>
          <div className=" lg:flex lg:justify-center my-4 flex justify-center w-full lg:my-0">
          <button className="bg-blue-200 lg:hover:bg-blue-300 text-blue-800 font-bold font-Philosopher px-[7.5rem] py-4 rounded-lg text-xl" onClick={() => {
            navigate("/donation")
          }}>
            I am an Donor
          </button>
          </div>
          
          
        </div>
    </div>
    </>
  )
}

export default onboarding