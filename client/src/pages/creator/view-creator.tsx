import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import QrCode from "qrcode";
import { SingleCreatorResponse } from "@/types/api-types";
import axios from "axios";
import { creatorTemp } from "@/redux/reducer/creatorreducer";

const ViewCreator = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search] = useSearchParams();
  const id = search.get("creatorId");

  const [qr, setQr] = useState("");
  const [singleTree, setSingleTree] = useState<any | null>(null);

  const { isPaid } = useSelector((state: RootState) => state.userReducer);

  const handleCreator = async () => {
    try {
      const { data }: { data: SingleCreatorResponse } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/creator/detailed/${id!}`,
        { withCredentials: true }
      );
      setSingleTree(data.creator);
      dispatch(creatorTemp(data.creator));
      const link = `${window.location.protocol}//${
        window.location.hostname
      }/display/creator?creatorId=${id!}`;
      const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
      setQr(qre);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleCreator();
  }, []);

  const delCreator = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/creator/delete/${id!}`,
        { withCredentials: true }
      );
      toast.success("Creator Deleted");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8">
      <h1 className="text-3xl font-semibold font-Kanit">Creator Details</h1>
      <div>
        {isPaid ? (
          <img src={qr} alt={singleTree?._id} />
        ) : (
          <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
        )}
      </div>
      <div className="space-y-4">
        <div className="flex">
          <div className="basis-1/2 ">
            <p className="font-semibold font-Kanit">CreatorId:</p>
          </div>
          <div className="basis-1/2">
            <span className="font-Kanit">{singleTree?._id}</span>
          </div>
        </div>
        <div className="flex">
          <div className="basis-1/2 ">
            <p className="font-semibold font-Kanit">Name:</p>
          </div>
          <div className="basis-1/2">
            <span className="font-Kanit">{singleTree?.name}</span>
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center py-2">
            <h1 className="text-2xl font-semibold font-Kanit underline">
              Social Links
            </h1>
          </div>
          {singleTree?.links?.map((link: any, index: number) => (
            <div className="flex">
              <div className="basis-1/2">
                <p key={index}>
                  <span className="font-semibold font-Kanit">
                    {link.label}:
                  </span>
                </p>
              </div>
              <div className="basis-1/2">
                <p className="font-Kanit">
                  <a href={`${link.name}`}>{link.name}</a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-6">
        <Button
        className="font-Kanit" 
        disabled={!isPaid}>
          <a href={qr} download={`${singleTree?._id}.png`}>
            Download
          </a>
        </Button>
        <Button
        className="font-Kanit"
          variant="outline"
          disabled={!isPaid}
          onClick={() =>
            navigate(`/dashboard/creator/input?creatorId=${singleTree?._id}`)
          }
        >
          Edit
        </Button>
        <Button
        className="font-Kanit"
          onClick={() => delCreator()}
          disabled={!isPaid}
          variant="destructive"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ViewCreator;
