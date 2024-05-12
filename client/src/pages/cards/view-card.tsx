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
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import TreeComponent from "@/components/view-card/tree";
import AnimalComponent from "@/components/view-card/animal";
import CreatorComponent from "@/components/view-card/creator";
import MedicalComponent from "@/components/view-card/medical";
import PersonalComponent from "@/components/view-card/personal";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Animal, Creator, MedicalType, Personal, Tree } from "@/types/types";
import { IoIosDownload } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

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
        ["tree", "personal", "medical", "creator", "animal"].includes(type!) &&
        id
      ) {
        try {
          const {
            data,
          }: {
            data:
              | SingleTreeResponse
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

  const headSetter = (headType: String) => {
    if (["tree", "personal", "medical", "creator", "animal"].includes(type!)) {
      return headType.charAt(0).toUpperCase() + headType.slice(1).toLowerCase();
    } else {
      return;
    }
  };

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
      case "tree":
        return <TreeComponent card={card as Tree} />;
      case "personal":
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

  const setLink = (type: String, id: String) => {
    switch (type) {
      case "tree":
        return `/dashboard/tree/create?treeId=${id}`;
      case "personal":
        return `/dashboard/personal/create?personalId=${id}`;
      case "medical":
        return `/dashboard/medical/create?medicalId=${id}`;
      case "creator":
        return `/dashboard/creator/create?creatorId=${id}`;
      case "animal":
        return `/dashboard/animal/create?animalId=${id}`;
      default:
        return `/dashboard/tree/create?treeId=${id}`;
    }
  };

  return (
    <>
      <div className="w-full">
        {/* <div>
                {(isPaid || user?.role === "admin") ? (
                    <img src={qr} alt={card?._id} />
                ) : (
                    <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                )}
            </div> */}
        <div>{loading ? <Loader /> : <>{renderCard()}</>}</div>
        <div className={`flex flex-row py-2 ${
              type === "tree" && "bg-yellow-200"
            } ${type === "animal" && "bg-orange-100"} ${
              type === "creator" && "bg-violet-400"
            } ${type === "medical" && "bg-violet-400"} ${type === "personal" && "bg-blue-300"}`}>
          <div
            className={`basis-1/3 w-full py-2 flex justify-center ${
              type === "tree" && "bg-yellow-200"
            } ${type === "animal" && "bg-orange-100"} ${
              type === "creator" && "bg-violet-400"
            } ${type === "medical" && "bg-violet-400"}`}
          >
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
          <div
            className={`basis-1/3 w-full py-2 flex justify-center ${
              type === "tree" && "bg-yellow-200"
            } ${type === "animal" && "bg-orange-100"} ${
              type === "creator" && "bg-violet-400"
            } ${type === "medical" && "bg-violet-400"}`}
          >
            <button
              className="py-1 px-5 bg-slate-300 font-Kanit rounded-full hover:cursor-pointer shadow-xl"
              disabled={!isPaid && user?.role !== "admin"}
              onClick={() => navigate(setLink(type!, card?._id!))}
            >
              <div className="flex justify-center">
                  <div className="">
                    <MdEdit className="w-[1.5rem] h-[1.5rem] text-black" />
                  </div>
                </div>
            </button>
          </div>
          <div
            className={`basis-1/3 w-full py-2 flex pb-4 justify-center ${
              type === "tree" && "bg-yellow-200"
            } ${type === "animal" && "bg-orange-100"} ${
              type === "creator" && "bg-violet-400"
            } ${type === "medical" && "bg-violet-400"}`}
          >
            <button
              className="py-4 bg-red-300 text-white font-Kanit px-4 rounded-full hover:cursor-pointer shadow-xl"
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
      </div>
    </>
  );
};

export default ViewCard;
