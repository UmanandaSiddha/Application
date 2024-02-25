import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { PaginationDemo } from "@/components/rest/pagination-demo";
import axios from "axios";
import { MedicalResponse } from "@/types/api-types";
import { medicalExist, medicalNotExist } from "@/redux/reducer/medicalReducer";
import MedicalCard from "@/components/rest/medical-card";

const Medical = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);

    const { medicals, loadings } = useSelector(
        (state: RootState) => state.medicalReducer
    );

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotTree = async () => {
        try {
            const { data }: { data: MedicalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/medical/userMedical?page=${currentPage}`, { withCredentials: true });
            dispatch(medicalExist(data.medical));
            setCountData(data.count);
        } catch (error: any) {
            dispatch(medicalNotExist());
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
        <Button onClick={() => navigate("/dashboard/medical/input")}>Create New Medical Vcard</Button>
        {!isPaid && <p>You are not Subscribed</p>}
        <h1 className="text-3xl">Your Medical Vcards</h1>
        <div className="flex flex-wrap p-4 gap-4 justify-center">
            {loadings ? <Loader /> : (
                medicals.map((medical) => (
                    <MedicalCard key={medical._id} medical={medical} isPaid={isPaid} />
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

export default Medical;