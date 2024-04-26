import axios from "axios";
import {
  AnimalResponse,
  CreatorResponse,
  MedicalResponse,
  PersonalResponse,
  TreeResponse,
} from "@/types/api-types";

import { BsQrCodeScan } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoShareOutline } from "react-icons/io5";
import { IoDownloadOutline } from "react-icons/io5";

import QrCode from "qrcode";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaginationDemo } from "@/components/rest/pagination-demo";
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

const VCard = ({ card, isPaid, user, type }: PropsType) => {
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
              className="rounded-lg"
              onClick={() => {
                navigate(`/dashboard/cards/card?id=${card?._id}&type=${type}`);
              }}
            />
          ) : (
            <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
          )}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="text-3xl font-semibold font-Alice">
          {type === "tree" && (
            <>
              {"scientificName" in card! && (
                <>
                  {/* <CardTitle>{card?.name}</CardTitle> */}
                  <p className="">{card?.name}</p>
                  {/* <CardDescription>{card?.scientificName}</CardDescription> */}
                </>
              )}
            </>
          )}
          {type === "personal" && (
            <>
              {"aboutMe" in card! && (
                <>
                  {/* <CardTitle>{card?.name}</CardTitle> */}
                  {/* <CardDescription>{card?.aboutMe.aboutme}</CardDescription> */}
                </>
              )}
            </>
          )}
          {type === "medical" && (
            <>
              {"personalInfo" in card! && (
                <>
                  {/* <CardTitle>{card?.personalInfo.name}</CardTitle> */}
                  {/* <CardDescription>{card?.personalInfo.gender}</CardDescription> */}
                  <p className="">
                    {card?.personalInfo.name}
                  </p>
                </>
              )}
            </>
          )}
          {type === "creator" && (
            <>
              {"name" in card! && (
                <>{/* <CardTitle>{card?.name}</CardTitle> */}
                <p className="">
                  {card?.name}
                </p>
                </>
              )}
            </>
          )}
          {type === "animal" && (
            <>
              {"gender" in card! && (
                <>
                  {/* <CardTitle>{card?.species}</CardTitle> */}
                  {/* <CardDescription>{card?.gender}</CardDescription> */}
                  <p className="">
                    {card?.name}
                  </p>
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

const AllCards = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const type = search.get("type");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { isPaid, user } = useSelector((state: RootState) => state.userReducer);

  const [currentPage, setCurrentPage] = useState(1);
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
  }, [currentPage]);

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

  function prevQR(){
    if (cards) {
      setCurrentIndex((prevIndex) => ((prevIndex === 0) ? (cards?.length - 1) : (prevIndex - 1)));
    };
  };

  function nextQR(){
    if(cards){
      setCurrentIndex((nextIndex) => ((nextIndex === cards.length - 1) ? 0 : (nextIndex + 1)));
    }
  }

  return (
    <>
      <div className={`font-Kanit h-[32rem] rounded-b-[4rem] z-10 relative shadow-lg ${type === 'tree' && ('bg-green-300')} ${type === 'personal' && ('bg-blue-300')} ${type === 'medical' && ('bg-blue-200')} ${type === 'creator' && ('bg-cyan-300')} ${type === 'animal' && ('bg-red-200')}`}>
        <div className="py-4 flex flex-row">
          <div className="basis-1/2 flex justify-center">
            <button className={`px-6 py-4 rounded-2xl hover:cursor-pointer hover:bg-green-400 shadow-lg ${type === 'tree' && ('bg-green-600')} ${type === 'medical' && ('bg-blue-700')} ${type === 'creator' && ('bg-cyan-500')} ${type === 'animal' && ('bg-red-300')}`}>
              <div className="flex flex-row">
                <div className="flex items-center px-2">
                  <BsQrCodeScan className="w-[1rem] h-[1rem] text-white" />
                </div>
                {/* <div className="flex items-center font-semibold text-white">
                  {type === 'tree' && ('Botanical Data')}
                  {type === 'personal' && ('Individual Data')}
                </div> */}
                {type === 'tree' && (
                  <div className="flex items-center font-semibold text-white">
                    Botanical Data
                  </div>
                )}
                {type === 'personal' && (
                  <div className="flex items-center font-semibold text-white">
                    Individual Data
                  </div>
                )}
                {type === 'medical' && (
                  <div className="flex items-center font-semibold text-white">
                    Medical Data
                  </div>
                )}
                {type === 'creator' && (
                  <div className="flex items-center font-semibold text-white">
                    Creator Data
                  </div>
                )}
                {type === 'animal' && (
                  <div className="flex items-center font-semibold text-white">
                    Animal Data
                  </div>
                )}
              </div>
            </button>
          </div>
          <div className="basis-1/2 flex justify-center">
            <button className="px-4 py-2 rounded-md border-none hover:cursor-pointer text-green-600">
              <div className={`flex flex-row ${type === 'tree' && ('text-green-700')} ${type === 'medical' && ('text-blue-600')} ${type === 'creator' && ('text-cyan-600')} ${type === 'animal' && ('text-red-400')}`}>
                <div className="flex items-center px-2">
                  <BsQrCodeScan className="w-[1rem] h-[1rem]" />
                </div>
                <div className={`flex items-center `}>Other QRs</div>
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-col py-6">
          <div className="flex justify-center">
            <p className="">Share this QR Code to share your</p>
          </div>
          <div className="flex justify-center font-bold text-2xl font-Alice">
          {type === 'tree' && (
                  <p className="">Botanical Data</p>
                )}
          {type === 'personal' && (
                  <p className="">Individual Data</p>
                )}
          {type === 'medical' && (
                  <p className="">Medical Data</p>
                )}
          {type === 'creator' && (
                  <p className="">Creator Data</p>
                )}
          </div>
        </div>
        <div className="flex flex-row pt-10 pb-6">
          <div className="basis-1/5 flex items-center justify-center">
            <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-slate-300 flex justify-center items-center hover:cursor-pointer">
              <IoIosArrowBack
                className="w-[2rem] h-[2rem]"
                onClick={prevQR}
              />
            </div>
          </div>
          <div className="basis-3/5 relative h-[14rem] ">
            {loading ? (
              <Loader />
            ) : (
              <div className="flex flex-row justify-center">
                {cards!.map((card, index) => (
                  <div className={`absolute block ml-[calc(-100%*${index})]${
                    index === currentIndex ? '' : ' hidden'
                  }`} key={index}>
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
            )}
          </div>
          <div className="basis-1/5 flex justify-center items-center">
            <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-slate-300 flex justify-center items-center hover:cursor-pointer">
              <MdOutlineNavigateNext className="w-[2rem] h-[2rem]" onClick={nextQR} />
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 bg-slate-100 -mt-[4rem]">
        <div className="mt-[4rem] flex flex-row">
          <div className="basis-1/2 flex justify-center hover:cursor-pointer">
            <button className={`px-12 py-2 rounded-3xl hover:cursor-pointer shadow-lg ${type === 'tree' && ('bg-green-300')} ${type === 'medical' && ('bg-blue-200')}`}>
              <div className="flex flex-col">
                <div className="flex justify-center items-center">
                  <IoShareOutline className="w-[2rem] h-[2rem]" />
                </div>
                <div className="flex items-center pt-2 font-semibold">
                  Share
                </div>
              </div>
            </button>
          </div>
          <div className="basis-1/2 flex justify-center">
            <button className={`px-10 py-8 rounded-3xl hover:cursor-pointer shadow-xl ${type === 'tree' && ('bg-green-300')} ${type === 'medical' && ('bg-blue-200')}`}>
              <div className="flex flex-col">
                <div className="flex justify-center items-center">
                  <IoDownloadOutline className="w-[2rem] h-[2rem]" />
                </div>
                <div className="flex items-center pt-2 font-semibold">
                  Download
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* // flex flex-col justify-center gap-4 items-center mt-8 */}
      <div className="w-full">
        {["tree", "personal", "medical", "creator", "animal"].includes(
          type!
        ) ? (
          <>
            {/* <Button onClick={() => navigate(setLink(type!))}>Create New {headSetter(type!)} Card</Button>
                    {(!isPaid && user?.role !== "admin") && <p>You are not Subscribed</p>}
                    <h1 className="text-3xl">Your {headSetter(type!)} Cards</h1> */}
            <div className="flex justify-center w-full py-6 bg-slate-100">
              {["tree", "personal", "medical", "creator", "animal"].includes(
                type!
              ) ? (
                <button
                  className={`px-[5rem] py-3 text-white rounded-md hover:cursor-pointer text-lg font-Kanit shadow-lg ${type === 'tree' && ('bg-green-500')} ${type === 'medical' && ('bg-blue-700')} ${type === 'creator' && ('bg-cyan-400')} ${type === 'animal' && ('bg-red-300')}`}
                  onClick={() => {
                    navigate(setLink(type!));
                  }}
                >
                  {!isPaid && user?.role !== "admin" ? (
                    <p>You are not Subscribed</p>
                  ) : (
                    "Add a new Vcard"
                  )}
                </button>
              ) : (
                <p className="">Error</p>
              )}
            </div>
            {/* {countData > 0 && (
                        <div>
                            <PaginationDemo currentPage={currentPage} total={Math.ceil(countData / 5)} setPage={setCurrentPageNo} />
                        </div>
                    )} */}
          </>
        ) : (
          <h1>You have enter a broken link, no cards here</h1>
        )}
      </div>
    </>
  );
};

export default AllCards;
