import { Button } from "@/components/ui/button";
import { deleteTree } from "@/redux/api/treeApi";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import QrCode from "qrcode";

import { toast } from "react-toastify";
import { SingleTreeResponse } from "@/types/api-types";
import axios from "axios";
import { treeTemp } from "@/redux/reducer/treeReducer";

const ViewTree = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [search] = useSearchParams();
    const id = search.get("treeId");

    const [singleTree, setSingleTree] = useState<any | null>(null);
    const [qr, setQr] = useState("");

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotTree = async () => {
        try {
            const { data }: { data: SingleTreeResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/tree/detailed/${id!}`, { withCredentials: true });
            setSingleTree(data.tree);
            dispatch(treeTemp(data.tree));
            if (isPaid) {
                const link = `${window.location.protocol}//${window.location.hostname}/display/tree?treeId=${id!}`
                const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
                setQr(qre)
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        gotTree();
    }, []);

    const delTree = async () => {
        try {
            await deleteTree(id!);
            toast.success("Tree Deleted");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8'>
                    <h1 className="text-3xl font-semibold">Tree Details</h1>
                    <div>
                        {isPaid ? (
                            <img src={qr} alt={singleTree?._id} />
                        ) : (
                            <img src="/error_qr.jpg" alt="Error Qr" width={250} height={250} />
                        )}
                    </div>
                    <div>
                        <p><span className="font-semibold">TreeId:</span> {singleTree?._id}</p>
                        <p><span className="font-semibold">Name:</span> {singleTree?.name}</p>
                        <p><span className="font-semibold">Scientific Name:</span> {singleTree?.scientificName}</p>
                        <p><span className="font-semibold">Tree Type:</span> {singleTree?.treeType}</p>
                        <p><span className="font-semibold">Location:</span> {singleTree?.location}</p>
                        <p><span className="font-semibold">Description:</span> {singleTree?.description}</p>
                        <p><span className="font-semibold">Special Features:</span> {singleTree?.features}</p>
                        <p><span className="font-semibold">Maintenance:</span> {singleTree?.maintenance}</p>
                        <p><span className="font-semibold">Benefits:</span> {singleTree?.benefits}</p>
                        <p><span className="font-semibold">Fun Facts:</span> {singleTree?.funFact}</p>
                    </div>
                    <div className="flex gap-6">
                        <Button disabled={!isPaid}><a href={qr} download={`${singleTree?._id}.png`}>Download</a></Button>
                        <Button variant="outline" disabled={!isPaid} onClick={() => navigate(`/dashboard/tree/create?treeId=${singleTree?._id}`)}>Edit</Button>
                        <Button onClick={() => delTree()} disabled={!isPaid} variant="destructive">Delete</Button>
                    </div>
                </div>
    )
}

export default ViewTree;