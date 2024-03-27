import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getUserTree } from "../../redux/api/treeApi";
import { treeExist, treeNotExist } from "../../redux/reducer/treeReducer";
import { useEffect, useState } from "react";
import { TreeCard } from "@/components/rest/tree-card";
import Loader from "@/components/rest/loader";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { PaginationDemo } from "@/components/rest/pagination-demo";

const Tree = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [countData, setCountData] = useState(1);

    const { tree, loading } = useSelector(
        (state: RootState) => state.treeReducer
    );

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotTree = async () => {
        try {
            const data = await getUserTree(currentPage);
            dispatch(treeExist(data.vCards));
            setCountData(data.count);
        } catch (error: any) {
            dispatch(treeNotExist());
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
            <Button onClick={() => navigate("/dashboard/tree/create")}>Create New Tree Vcard</Button>
            {!isPaid && <p>You are not Subscribed</p>}
            <h1 className="text-3xl">Your Tree Vcards</h1>
            <div className="flex flex-wrap p-4 gap-4 justify-center">
                {loading ? <Loader /> : (
                    tree.map((tr) => (
                        <TreeCard key={tr._id} tree={tr} isPaid={isPaid} />
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

export default Tree;