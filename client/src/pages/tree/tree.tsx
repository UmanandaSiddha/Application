import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getUserTree } from "../../redux/api/treeApi";
import { treeExist, treeNotExist } from "../../redux/reducer/treeReducer";
import { useEffect } from "react";
import { TreeCard } from "@/components/rest/card";
import Loader from "@/components/rest/loader";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Tree = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { tree, loading } = useSelector(
        (state: RootState) => state.treeReducer
    );

    const { isPaid } = useSelector(
        (state: RootState) => state.userReducer
    );

    const gotTree = async () => {
        try {
            const data = await getUserTree();
            dispatch(treeExist(data.tree));
        } catch (error: any) {
            dispatch(treeNotExist());
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        gotTree();
    }, [])

    return (
        <div className='flex flex-col justify-center gap-4 items-center mt-8'>
            <Button onClick={() => navigate("/dashboard/tree/create")} disabled={!isPaid}>Create New Tree Vcard</Button>
            {!isPaid && <p>You are not Subscribed</p>}
            <h1 className="text-3xl">Your Tree Vcards</h1>
            <div className="flex flex-wrap p-4 gap-4 justify-center">
                {loading ? <Loader /> : (
                    tree.map((tr) => (
                        <TreeCard key={tr._id} tree={tr} />
                    )).reverse()
                )}
            </div>
        </div>
    )
}

export default Tree;