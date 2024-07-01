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
        <div className="w-full flex justify-center pt-4">
            <div className="w-[100%] text-white">
                <div className="flex flex-row font-Kanit items-center w-full border-2 border-slate-300 rounded-lg">
                    <div className="basis-1/7 pl-2 py-3">
                        <Icon className="w-[1.5rem] h-[1.5rem] text-black" />
                    </div>
                    <div className="basis-5/7 flex justify-start pl-3 w-full font-Kanit text-[1.5rem] font-bold text-black py-3">
                        {title}
                    </div>
                    <button
                        className="basis-1/7 bg-slate-100 flex justify-center px-3 py-3"
                        disabled={!isVerified}
                        onClick={() => {
                            navigate(`/dashboard/cards?type=${type}`);
                        }}
                    >
                        <IoIosAdd className="w-[2rem] h-[2rem] hover:cursor-pointer text-black" />
                    </button>
                </div>
            </div>
        </div>
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
