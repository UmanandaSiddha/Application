import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { PaginationDemo } from "@/components/rest/pagination-demo";
import axios from "axios";
import { PersonalResponse } from "@/types/api-types";
import { personalExist, personalNotExist } from "@/redux/reducer/personalReducer";
import PersonalCard from "@/components/rest/personal-card";

const Personal = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);

    const { personals, loading } = useSelector(
        (state: RootState) => state.personalReducer
    );

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotTree = async () => {
        try {
            const { data }: { data: PersonalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/personal/userPersonal?page=${currentPage}`, { withCredentials: true });
            dispatch(personalExist(data.personal));
            setCountData(data.count);
        } catch (error: any) {
            dispatch(personalNotExist());
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
            <Button onClick={() => navigate("/dashboard/personal/input")}>Create New Personal Vcard</Button>
            {!isPaid && <p>You are not Subscribed</p>}
            <h1 className="text-3xl">Your Personal Vcards</h1>
            <div className="flex flex-wrap p-4 gap-4 justify-center">
                {loading ? <Loader /> : (
                    personals.map((personal) => (
                        <PersonalCard key={personal._id} personal={personal} isPaid={isPaid} />
                    ))
                )}
            </div>
            {countData > 0 && (
                <div>
                    <PaginationDemo currentPage={currentPage} total={Math. ceil(countData / 5)} setPage={setCurrentPageNo} />
                </div>
            )}
        </div>
    )
}

export default Personal;