import { Button } from "@/components/ui/button";
import { getSingleTree, deleteTree } from "@/redux/api/treeApi";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { treeNotTemp, treeTemp } from "../../redux/reducer/treeReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Loader from "@/components/rest/loader";
import QrCode from "qrcode";

import { toast } from "react-toastify";

const ViewTree = () => {

    const navigate = useNavigate();
    const [search] = useSearchParams();
    const id = search.get("treeId");

    const dispatch = useDispatch();
    const [qr, setQr] = useState("");

    const { trus, loading } = useSelector(
        (state: RootState) => state.treeReducer
    );

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotTree = async () => {
        try {
            const data = await getSingleTree(id!);
            dispatch(treeTemp(data.tree));
            if (isPaid) {
                const link = `${window.location.protocol}//${window.location.hostname}/display/tree?treeId=${id!}`
                const qre = await QrCode.toDataURL(link, { width: 200, margin: 2 });
                setQr(qre)
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            dispatch(treeNotTemp());
        }
    }

    useEffect(() => {
        gotTree();
    }, []);

    const delTree = async () => {
        try {
            await deleteTree(id!);
            // const data = await deleteTree(id!);
            // console.log(data);
            toast.success("Tree Deleted");
            navigate(-1);
        } catch (error: any) {
            toast.error(error.response.data.message);
            dispatch(treeNotTemp());
        }
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className='flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8'>
                    <h1 className="text-3xl font-semibold">Tree Details</h1>
                    <div>
                        {isPaid ? (
                            <img src={qr} alt={trus?._id} />
                        ) : (
                            <p>Subscribe to view QR</p>
                        )}
                    </div>
                    {isPaid ? (
                        <div>
                            <p><span className="font-semibold">TreeId:</span> {trus?._id}</p>
                            <p><span className="font-semibold">Name:</span> {trus?.name}</p>
                            <p><span className="font-semibold">Scientific Name:</span> {trus?.scientificName}</p>
                            <p><span className="font-semibold">Tree Type:</span> {trus?.treeType}</p>
                            <p><span className="font-semibold">Location:</span> {trus?.location}</p>
                            <p><span className="font-semibold">Description:</span> {trus?.description}</p>
                            <p><span className="font-semibold">Special Features:</span> {trus?.features}</p>
                            <p><span className="font-semibold">Maintenance:</span> {trus?.maintenance}</p>
                            <p><span className="font-semibold">Benefits:</span> {trus?.benefits}</p>
                            <p><span className="font-semibold">Fun Facts:</span> {trus?.funFact}</p>
                        </div>
                    ) : (
                        <div>
                            Subscribe to view Tree Details
                        </div>
                    )}
                    <div className="flex gap-6">
                        <Button disabled={!isPaid}><a href={qr} download={`${trus?._id}.png`}>Downlaod</a></Button>
                        <Button variant="outline" disabled={!isPaid} onClick={() => navigate(`/dashboard/tree/create?treeId=${trus?._id}`)}>Edit</Button>
                        <Button onClick={() => delTree()} disabled={!isPaid} variant="destructive">Delete</Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewTree;