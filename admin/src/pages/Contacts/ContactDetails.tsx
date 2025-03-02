import { toast } from "react-toastify";
import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { IContact } from "../../types/type";
import API from "../../config/apiConfig";

const ContactDetails = () => {

    const [search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const [contact, setContact] = useState<IContact>();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchContact = async () => {
        setLoading(true);
        try {
            const { data }: { data: any } = await API.get(`/admin/contacts/byId/${id}`);
            setContact(data.contact);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchContact();
    }, [id]);

    const handleSwitch = async () => {
        try {
            const { data }: { data: any } = await API.put(`/admin/contacts/byId/${id}`, {});
            setContact(data.contact);
            toast.success("Card updated successfully");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handleDelete = async () => {
        try {
            await API.delete(`/admin/contacts/byId/${id}`);
            toast.success("Contact deleted successfully");
            navigate(-1)
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        setOpen(false);
    }

    return loading ? (
        <Loader />
    ) : (
        <DefaultLayout>
            <div className="flex flex-wrap items-center justify-evenly gap-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl text-white underline font-semibold">Contact Details</h1>
                    <p className="text-white"><span className="font-semibold">Id:</span> {contact?._id}</p>
                    <p className="text-white"><span className="font-semibold">Name:</span> {contact?.name}</p>
                    <p className="text-white"><span className="font-semibold">Email:</span> {contact?.email}</p>
                    <p className="text-white"><span className="font-semibold">Message:</span> {contact?.message}</p>
                    <p className="text-white"><span className="font-semibold">Report:</span> {String(contact?.report).toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Attended:</span> {String(contact?.attended).toUpperCase()}</p>
                    <p className="text-white"><span className="font-semibold">Contact Created</span> - {String(new Date(contact?.createdAt!).toDateString())}</p>
                    <p className="text-white"><span className="font-semibold">Contact Upadated</span> - {String(new Date(contact?.updatedAt!).toDateString())}</p>
                </div>

                {open && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur flex justify-center items-center z-10">
                        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 w-[90%] md:w-[50%] lg:w-[30%]">
                            <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Are you sure you want to deactivate this contact?</h2>
                            <div className="w-full mt-8 flex justify-between items-center gap-8">
                                <button className="w-1/2 px-3 py-2 border-2 border-red-500 rounded-lg bg-red-500 text-white" onClick={handleDelete}>
                                    Yes, I am sure!!
                                </button>
                                <button className="w-1/2 px-3 py-2 border-2 text-white rounded-lg" onClick={() => setOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col gap-4">
                    <button onClick={handleSwitch} className="flex w-full justify-center rounded bg-green-500 p-3 font-medium text-gray hover:bg-opacity-90">
                        Switch Attended
                    </button>
                    <button onClick={() => setOpen(true)} className="flex w-full justify-center rounded bg-red-500 p-3 font-medium text-gray hover:bg-opacity-90">
                        Delete Contact
                    </button>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default ContactDetails;