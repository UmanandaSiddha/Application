import { CgProfile } from "react-icons/cg";
import { MdOutlineMedicalServices, MdOutlineSubscriptions } from "react-icons/md";
import { IoPawOutline } from "react-icons/io5";
import { RiPlantLine } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IconType } from "react-icons";

interface ButtonItemProps {
    icon: IconType;
    title: string;
    type: string;
    isVerified: boolean;
}

const ButtonItem: React.FC<ButtonItemProps> = ({ icon: Icon, title, type, isVerified }) => {
    const navigate = useNavigate();
    return (
        <button 
            className="w-full flex justify-center pt-4" 
            disabled={!isVerified}
            onClick={() => {
                navigate(`/dashboard/cards/${type}`);
            }}
        >
            <div className="w-[100%] text-white">
                <div className="flex flex-row items-center w-full border-2 border-slate-300 bg-white rounded-lg">
                    <div className="basis-1/7 pl-2 py-3">
                        <Icon className="w-[1.5rem] h-[1.5rem] text-black" />
                    </div>
                    <div className="basis-5/7 flex justify-start pl-3 w-full text-[1.5rem] font-bold text-black py-3">
                        {title}
                    </div>
                    <div className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3">
                        <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
                    </div>
                </div>
            </div>
        </button>
    );
};

const SideBar = () => {

    const { user } = useSelector(
        (state: RootState) => state.userReducer
    );

    const buttonData = [
        { icon: CgProfile, title: "Individual", type: "individual" },
        { icon: RiPlantLine, title: "Botany", type: "botanical" },
        { icon: MdOutlineMedicalServices, title: "Medical", type: "medical" },
        { icon: MdOutlineSubscriptions, title: "Creator", type: "creator" },
        { icon: IoPawOutline, title: "Animal", type: "animal" },
    ];

    return (
        <div className="sm:justify-start flex flex-wrap justify-center md:border-r-2 md:py-[4rem] md:pr-4 md:border-r-slate-400 lg:border-r-2 lg:py-[4rem] lg:pr-4 lg:border-r-slate-400 mt-10">
            <div className="md:hidden w-full">
                <div className="text-3xl md:text-4xl font-semibold h-16">
                    Hello, <span className="text-blue-500">{user?.name}</span>
                </div>
                <div className="space-y-2 mt-4">
                    <p className="text-2xl font-semibold">My Dashboard</p>
                    <div className="w-full h-1 bg-blue-500 rounded-full" />
                </div>
            </div>
            {buttonData.map((butt, index) => (
                <ButtonItem
                    key={index}
                    icon={butt.icon}
                    title={butt.title}
                    type={butt.type}
                    isVerified={user?.isVerified!}
                />
            ))}
        </div>
    );
};

export default SideBar;
