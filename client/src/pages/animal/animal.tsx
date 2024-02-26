import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import Loader from "@/components/rest/loader";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { PaginationDemo } from "@/components/rest/pagination-demo";
import axios from "axios";
import { AnimalResponse } from "@/types/api-types";
import { animalExist, animalNotExist } from "@/redux/reducer/animalReducer";
import { AnimalCard } from "@/components/rest/animal-card";

const Animal = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);

    const { animals, loading } = useSelector(
        (state: RootState) => state.animalReducer
    );

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotAnimal = async () => {
        try {
            const { data }: { data: AnimalResponse } = await axios.get(`${import.meta.env.VITE_BASE_URL}/animal/userAnimal?page=${currentPage}`, { withCredentials: true });
            dispatch(animalExist(data.animal));
            setCountData(data.count);
        } catch (error: any) {
            dispatch(animalNotExist());
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        gotAnimal();
    }, [currentPage]);

    const setCurrentPageNo = (e: any) => {
        setCurrentPage(e);
    }

    return (
        <div className='flex flex-col justify-center gap-4 items-center mt-8'>
            <Button onClick={() => navigate("/dashboard/animal/create")}>Create New Animal Vcard</Button>
            {!isPaid && <p>You are not Subscribed</p>}
            <h1 className="text-3xl">Your Animal Vcards</h1>
            <div className="flex flex-wrap p-4 gap-4 justify-center">
                {loading ? <Loader /> : (
                    animals.map((animal) => (
                        <AnimalCard key={animal._id} animal={animal} isPaid={isPaid} />
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

export default Animal;