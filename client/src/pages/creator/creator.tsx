import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { PaginationDemo } from "@/components/rest/pagination-demo";
import axios from "axios";
import { CreatorResponse } from "@/types/api-types";
import CreatorCard from "@/components/rest/creator-card";
import { creatorExist, creatorNotExist } from "@/redux/reducer/creatorreducer";

const Creator = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);

    const { creators, loading } = useSelector(
        (state: RootState) => state.creatorReducer
    );

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotTree = async () => {
        try {
            const { data }: { data: CreatorResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/creator/userCreator?page=${currentPage}`, { withCredentials: true });
            dispatch(creatorExist(data.creator));
            setCountData(data.count);
        } catch (error: any) {
            dispatch(creatorNotExist());
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        gotTree();
    }, [currentPage]);

    const setCurrentPageNo = (e: any) => {
        setCurrentPage(e);
    }

    return (
        <div className='flex flex-col justify-center gap-4 items-center mt-8'>
            <Button onClick={() => navigate("/dashboard/creator/input")}>Create New Creator Vcard</Button>
            {!isPaid && <p>You are not Subscribed</p>}
            <h1 className="text-3xl">Your Creator Vcards</h1>
            <div className="flex flex-wrap p-4 gap-4 justify-center">
                {loading ? <Loader /> : (
                    creators.map((creator) => (
                        <CreatorCard key={creator._id} creator={creator} isPaid={isPaid} />
                    ))
                )}
            </div>
            {countData > 0 && (
                <div>
                    <PaginationDemo currentPage={currentPage} total={Math.ceil(countData / 5)} setPage={setCurrentPageNo} />
                </div>
            )}
        </div>
    )
}

export default Creator;