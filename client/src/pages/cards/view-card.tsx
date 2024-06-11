import {
  SingleAnimalResponse,
  SingleCreatorResponse,
  SingleMedicalResponse,
  SinglePersonalResponse,
  SingleTreeResponse,
} from "@/types/api-types";
import axios from "axios";
import QrCode from "qrcode";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Loader from "@/components/rest/loader";
import { IoIosDownload } from "react-icons/io";
import TreeComponent from "@/components/view-card/tree";
import AnimalComponent from "@/components/view-card/animal";
import CreatorComponent from "@/components/view-card/creator";
import MedicalComponent from "@/components/view-card/medical";
import PersonalComponent from "@/components/view-card/personal";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/card_types";

const ViewCard = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const id = search.get("id");
  const type = search.get("type");

  const [card, setCard] = useState<
    Tree | Personal | MedicalType | Creator | Animal | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState("");

  const { isPaid, user } = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (
        ["botanical", "individual", "medical", "creator", "animal"].includes(type!) &&
        id
      ) {
        try {
          const {
            data,
          }: {
            data:
              SingleTreeResponse
              | SinglePersonalResponse
              | SingleMedicalResponse
              | SingleCreatorResponse
              | SingleAnimalResponse;
          } = await axios.get(
            `${
              import.meta.env.VITE_BASE_URL
            }/cards/detailed/${id!}?type=${type}`,
            { withCredentials: true }
          );
          setCard(data.vCard);
          localStorage.setItem("current_card", JSON.stringify(data.vCard));
          if (isPaid || user?.role === "admin") {
            const link = `${window.location.protocol}//${window.location.host}/display?id=${id}&type=${type}`;
            const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
            setQr(qre);
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      }
      setLoading(false);
    };

    const cardData = localStorage.getItem("current_card");
    if (cardData) {
      setCard(JSON.parse(cardData));
      if (card?._id !== id) {
        fetchData();
      }
    } else {
      fetchData();
    }
  }, [type]);

  const deleteCard = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=tree`,
        { withCredentials: true }
      );
      toast.success("Card Deleted");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const renderCard = () => {
    switch (type) {
      case "botanical":
        return <TreeComponent card={card as Tree} />;
      case "individual":
        return <PersonalComponent card={card as Personal} />;
      case "medical":
        return <MedicalComponent card={card as MedicalType} />;
      case "creator":
        return <CreatorComponent card={card as Creator} />;
      case "animal":
        return <AnimalComponent card={card as Animal} />;
      default:
        return <h1>You have enter a broken link, no cards here</h1>;
    }
  };

  return (
    <>
      <div className="w-full lg:-ml-[1rem] h-full lg:flex lg:flex-row">
        <div className="lg:basis-5/6 lg:overflow-y-auto lg:mt-2 lg:rounded-tl-2xl">
          {loading ? <Loader /> : <>{renderCard()}</>}
        </div>
        <div
          className={`lg:basis-1/6 lg:w-[60%] lg:h-[45%] lg:items-center lg:mt-2 lg:rounded-r-2xl ${
            type === "tree" && "bg-green-400"
          } ${type === "medical" && "bg-violet-300"} ${type === "personal" && "bg-blue-300"} ${type === "creator" && "bg-violet-300"} ${type === "animal" && "bg-orange-200"}`}
        >
          <div
            className={`flex flex-row lg:hidden lg:bottom-0 lg:w-2/5 lg:mb-3 lg:rounded-2xl py-2 ${
              type === "tree" && "bg-yellow-200"
            } ${type === "animal" && "bg-orange-100"} ${
              type === "creator" && "bg-violet-600"
            } ${type === "medical" && "bg-violet-400 lg:bg-violet-500"} ${
              type === "personal" && "bg-blue-300"
            }`}
          >
            <div
              className={`basis-1/3 w-full py-2 flex justify-center lg:items-center`}
            >
              <div className="">
                <a href={qr} download={`${card?._id}.png`}>
                  <button
                    className="py-4 px-4 bg-green-200 text-black font-Kanit w-full rounded-full hover:cursor-pointer shadow-xl"
                    disabled={!isPaid && user?.role !== "admin"}
                  >
                    <div className="flex">
                      <div className="flex justify-center">
                        <IoIosDownload className="w-[1.5rem] h-[1.5rem]" />
                      </div>
                    </div>
                  </button>
                </a>
              </div>
            </div>
            <div
              className={`basis-1/3 w-full py-2 flex justify-center lg:items-center`}
            >
              <button
                className="py-4 px-4 bg-slate-300 font-Kanit rounded-full hover:cursor-pointer shadow-xl"
                disabled={!isPaid && user?.role !== "admin"}
                onClick={() => navigate(`/dashboard/${type}/create?${type}Id=${card?._id}`)}
              >
                <div className="flex justify-center">
                  <div className="">
                    <MdEdit className="w-[1.5rem] h-[1.5rem] text-black" />
                  </div>
                </div>
              </button>
            </div>
            <div
              className={`basis-1/3 w-full flex lg:items-center justify-center`}
            >
              <button
                className=" bg-red-300 text-white font-Kanit px-4 py-4 rounded-full hover:cursor-pointer shadow-xl"
                disabled={!isPaid && user?.role !== "admin"}
                onClick={() => deleteCard()}
              >
                <div className="flex justify-center">
                  <div className="">
                    <MdDelete className="w-[1.5rem] h-[1.5rem] text-red-500" />
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div
              className={`basis-1/3 w-full py-2 flex lg:flex-col justify-center my-2 lg:items-center`}
            >
              <div className="">
                <a href={qr} download={`${card?._id}.png`}>
                  <button
                    className="py-4 px-4 bg-green-200 text-black font-Kanit w-full rounded-full hover:cursor-pointer shadow-xl"
                    disabled={!isPaid && user?.role !== "admin"}
                  >
                    <div className="flex">
                      <div className="flex justify-center">
                        <IoIosDownload className="w-[1.5rem] h-[1.5rem]" />
                      </div>
                    </div>
                  </button>
                </a>
              </div>
              <div className="font-Philosopher lg:mt-2">Download</div>
            </div>
            <div
              className={`basis-1/3 w-full py-2 flex flex-col justify-center lg:items-center my-2`}
            >
              <div className="">
              <button
                className="py-4 px-4 bg-slate-300 font-Kanit rounded-full hover:cursor-pointer shadow-xl"
                disabled={!isPaid && user?.role !== "admin"}
                onClick={() => navigate(`/dashboard/${type}/create?${type}Id=${card?._id}`)}
              >
                <div className="flex justify-center">
                  <div className="">
                    <MdEdit className="w-[1.5rem] h-[1.5rem] text-black" />
                  </div>
                </div>
              </button>
              </div>
              <div className="font-Philosopher lg:mt-2">Edit</div>
            </div>
            <div
              className={`basis-1/3 w-full flex lg:items-center flex-col justify-center my-2`}
            >
              <div className="">
              <button
                className=" bg-red-300 text-white font-Kanit px-4 py-4 rounded-full hover:cursor-pointer shadow-xl"
                disabled={!isPaid && user?.role !== "admin"}
                onClick={() => deleteCard()}
              >
                <div className="flex justify-center">
                  <div className="">
                    <MdDelete className="w-[1.5rem] h-[1.5rem] text-red-500" />
                  </div>
                </div>
              </button>
              </div>
              <div className="font-Philosopher lg:mt-2">Delete</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCard;
