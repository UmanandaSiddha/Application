import React, { ChangeEvent } from "react";
import axios from "axios";
import {
  AnimalResponse,
  CreatorResponse,
  MedicalResponse,
  PersonalResponse,
  TreeResponse,
} from "@/types/api-types";

import QrCode from "qrcode";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import {
  Animal,
  Creator,
  MedicalType,
  Personal,
  Tree,
  User,
} from "../../types/types";

interface PropsType {
  card: Tree | Personal | MedicalType | Creator | Animal | null;
  user: User;
  isPaid: boolean;
  type: String;
}

const VCard = ({ card, user, isPaid, type }: PropsType) => {
  const navigate = useNavigate();
  const [qr, setQr] = useState("");

  const generateCode = async () => {
    try {
      if ((isPaid || user.role === "admin") && card) {
        const link = `${window.location.protocol}//${window.location.host}/display?id=${card._id}&type=${type}`;
        const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
        setQr(qre);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    generateCode();
  }, [isPaid, card, user.role, type]);

  return (
    <>
      <div className=" flex flex-col">
        <div className="flex">
          <div className="justify-center">
            {isPaid || user.role === "admin" ? (
              <img
                src={qr}
                alt={card?._id}
                width={130}
                height={130}
                className="rounded-lg"
                onClick={() => {
                  navigate(
                    `/dashboard/cards/card?id=${card?._id}&type=${type}`
                  );
                }}
              />
            ) : (
              <img
                src="/error_qr.jpg"
                alt="Error Qr"
                width={250}
                height={250}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center lg:mt-2">
          <div className="text-xl font-semibold font-Philosopher">
            {type === "tree" && (
              <>
                {"scientificName" in card! && (
                  <>
                    <p className="">{card?.name}</p>
                  </>
                )}
              </>
            )}
            {type === "personal" && (
              <>
                {"name" in card! && (
                  <>
                    <p className="">{card?.name}</p>
                  </>
                )}
              </>
            )}
            {type === "medical" && (
              <>
                {"personalInfo" in card! && (
                  <>
                    <p className="">{card?.personalInfo.name}</p>
                  </>
                )}
              </>
            )}
            {type === "creator" && (
              <>
                {"name" in card! && (
                  <>
                    <p className="">{card?.name}</p>
                  </>
                )}
              </>
            )}
            {type === "animal" && (
              <>
                {"gender" in card! && (
                  <>
                    <p className="">{card?.name}</p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const OtherQR = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const type = search.get("type");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [query, setQuery] = useState<string>("");

  const { isPaid, user } = useSelector((state: RootState) => state.userReducer);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cards, setCards] = useState<
    Tree[] | Personal[] | MedicalType[] | Creator[] | Animal[] | null
  >([]);
  const [countData, setCountData] = useState(1);
  const [loading, setLoading] = useState(false);

  const headSetter = (headType: String) => {
    if (["tree", "personal", "medical", "creator", "animal"].includes(type!)) {
      return headType.charAt(0).toUpperCase() + headType.slice(1).toLowerCase();
    } else {
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (
        ["tree", "personal", "medical", "creator", "animal"].includes(type!)
      ) {
        try {
          const {
            data,
          }: {
            data:
              | TreeResponse
              | PersonalResponse
              | MedicalResponse
              | CreatorResponse
              | AnimalResponse;
          } = await axios.get(
            `${
              import.meta.env.VITE_BASE_URL
            }/cards/user?page=${currentPage}&type=${type}`,
            { withCredentials: true }
          );
          setCards(data.vCards);
          setCountData(data.count);
          localStorage.setItem("all_card", JSON.stringify(data.vCards));
          localStorage.setItem("current_page", JSON.stringify(currentPage));
          localStorage.setItem("card_type", JSON.stringify(type));
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      }
      setLoading(false);
    };

    const cardData = localStorage.getItem("all_card");
    const cardType = localStorage.getItem("card_type");
    const currentCardPage = localStorage.getItem("current_page");
    if (
      cardData &&
      cardType === type &&
      Number(currentCardPage ? JSON.parse(currentCardPage) : 1) === currentPage
    ) {
      setCards(JSON.parse(cardData));
    } else {
      fetchData();
    }
  }, [currentPage, type]);

  const setCurrentPageNo = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const setLink = (type: String) => {
    switch (type) {
      case "tree":
        return `/dashboard/tree/create`;
      case "personal":
        return `/dashboard/personal/create`;
      case "medical":
        return `/dashboard/medical/create`;
      case "creator":
        return `/dashboard/creator/create`;
      case "animal":
        return `/dashboard/animal/create`;
      default:
        return `/dashboard/tree/create`;
    }
  };

  function prevQR() {
    if (cards) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? cards?.length - 1 : prevIndex - 1
      );
    }
  }

  function nextQR() {
    if (cards) {
      setCurrentIndex((nextIndex) =>
        nextIndex === cards.length - 1 ? 0 : nextIndex + 1
      );
    }
  }

  function handleChangeSearch(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setTimeout(() => {
      console.log(e.target.value);
    }, 1000);
  }

  return (
    <>
    {(!isPaid && user?.role !== "admin") ? (
      <>
      <div className="w-full">
        <div className="flex justify-center pt-[2rem]">
          <p className="font-Philosopher text-lg text-red-400">
            You are not subscribed!
          </p>
        </div>
      </div>
      </>
    ) : (
      <>
      <div className="lg:w-full">
        <div className="lg:flex lg:justify-center lg:pt-[2rem]">
          <p className="font-Philosopher text-lg">
            Here are all your {type} cards!
          </p>
        </div>
        <div className="lg:flex lg:justify-center">
          <div className="lg:grid-cols-1 lg:w-[80%] lg:gap-y-[1rem] lg:h-full lg:my-[2rem] lg:gap-0 lg:pt-2 grid grid-cols-2 gap-2 -ml-2">
            {cards?.map((card, index) => (
              <div className="flex justify-center" key={index}>
                <VCard
                  key={card._id}
                  type={type!}
                  card={card}
                  isPaid={isPaid}
                  user={user!}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
    )} 
    </>
  );
};

export default OtherQR;
