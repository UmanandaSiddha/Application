import { FaDonate } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";

const Donation = () => {
  return (
    <>
      <div className="w-full mb-[2rem] md:flex md:justify-center">
        <div className="md:w-[70%] lg:w-[60%]">
          <div className="font-Philosopher md:text-2xl lg:text-2xl text-xl font-bold flex justify-center mt-[2rem]">
            Become a helping hand...
          </div>
          <div className="w-full flex justify-center">
            <div className="w-[90%] mt-[2rem]">
              <div className="w-full shadow-2xl rounded-lg pb-[0.5rem] pt-[1rem] px-[1rem]">
                <div className="flex justify-center mt-[1rem]">
                  <FaDonate className="text-[3rem]" />
                </div>
                <div className="font-Kanit text-base my-[2rem] flex justify-center">
                  <div className="w-[90%]">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Libero, quas sed! Aspernatur, sapiente? Libero perferendis
                    consequuntur est optio incidunt error quis facilis. Dolores,
                    obcaecati!
                  </div>
                </div>
                <div className="text-sm my-[2rem]">
                  <div className="flex justify-start">
                    <div className="flex flex-row justify-start">
                      <SiTicktick className="text-[1rem] mx-4" />
                      <p className="font-Philosopher text-[1.3rem] text-blue-400">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                  <div className="w-[80%] md:w-[90%] lg:w-[90%] ml-[3rem] mt-2">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Consequuntur, laudantium quis ad doloremque quos nostrum.
                    Tenetur non aut deserunt ut aperiam iusto doloremque eaque
                    quas.
                  </div>
                </div>
                <div className="text-sm my-[2rem]">
                  <div className="flex justify-start">
                    <div className="flex flex-row justify-start">
                      <SiTicktick className="text-[1rem] mx-4" />
                      <p className="font-Philosopher text-[1.3rem] text-blue-400">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                  <div className="w-[80%] md:w-[90%] lg:w-[90%] ml-[3rem] mt-2">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Consequuntur, laudantium quis ad doloremque quos nostrum.
                    Tenetur non aut deserunt ut aperiam iusto doloremque eaque
                    quas.
                  </div>
                </div>
                <div className="text-sm my-[2rem]">
                  <div className="flex justify-start">
                    <div className="flex flex-row justify-start">
                      <SiTicktick className="text-[1rem] mx-4" />
                      <p className="font-Philosopher text-[1.3rem] text-blue-400">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>
                  <div className="w-[80%] md:w-[90%] lg:w-[90%] ml-[3rem] mt-2">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Consequuntur, laudantium quis ad doloremque quos nostrum.
                    Tenetur non aut deserunt ut aperiam iusto doloremque eaque
                    quas.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <button
              type="button"
              className="bg-blue-600 text-white font-Philosopher py-2 w-[90%] rounded-md hover:cursor-pointer hover:bg-blue-500"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donation;
