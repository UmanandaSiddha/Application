import { Button } from "@/components/ui/button";
import { getSingleTree, deleteTree } from "@/redux/api/treeApi";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { treeTemp } from "../../redux/reducer/treeReducer";
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


    const gotTree = async () => {
        try {
            const data = await getSingleTree(id!);
            dispatch(treeTemp(data.tree));
            const link = `${window.location.protocol}//${window.location.hostname}:5173/display/tree?treeId=${id!}`
            const qre = await QrCode.toDataURL(link, {width: 200, margin: 2});
            setQr(qre)
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        gotTree();
    }, []);

    const { trus, loading } = useSelector(
        (state: RootState) => state.treeReducer
    );

    const delTree = async () => {
        try {
            const data = await deleteTree(id!);
            console.log(data);
            toast.success("Tree Deleted");
            navigate("/dashboard/tree");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <>
            { loading ? (
                <Loader />
            ) : (
                <div className='flex flex-col justify-center border border-primary p-6 gap-4 items-center mx-4 my-8'>
                    <h1 className="text-3xl font-semibold">Tree Details</h1>
                    <div>
                        <img src={qr} alt={trus?._id} />
                    </div>
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
                    <div className="flex gap-6">
                        <Button><a href={qr} download={`${trus?._id}.png`}>Downlaod</a></Button>
                        <Button variant="outline" onClick={() => navigate(`/dashboard/tree/update?treeId=${trus?._id}`)}>Edit</Button>
                        <Button onClick={() => delTree()} variant="destructive">Delete</Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewTree;