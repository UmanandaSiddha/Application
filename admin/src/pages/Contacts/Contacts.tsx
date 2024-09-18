import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEffect, useState } from 'react';
import { Contact } from '../../types/types';
import { AllContactResponse } from '../../types/api-types';
import axios from 'axios';
import { toast } from 'react-toastify';

const Contacts = () => {

    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>();
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredContacts: 1,
        totalContacts: 1
    });


    const fetchContacts = async (url: string) => {
        try {
            const { data }: { data: AllContactResponse } = await axios.get(url, { withCredentials: true });
            setContacts(data.contacts);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredContacts: data.filteredContactsCount,
                totalContacts: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const link = `${import.meta.env.VITE_BASE_URL}/admin/contacts/all?page=${counts.currentPage}`;
        fetchContacts(link);
    }, [counts.currentPage]);

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Contacts
                        </h4>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                disabled={counts.currentPage === 1}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Prev
                            </button>
                            <p className="text-md font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.filteredContacts / counts.resultPerPage)}</p>
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                disabled={counts.currentPage === Math.ceil(counts.filteredContacts / counts.resultPerPage)}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Name</p>
                        </div>
                        <div className="col-span-3 hidden items-center sm:flex">
                            <p className="font-medium">Email</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Report</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Attended</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="font-medium">Date</p>
                        </div>
                    </div>

                    {contacts?.map((contact, key) => (
                        <div
                            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                            key={key}
                            onClick={() => navigate(`/contact-details?id=${contact._id}`)}
                        >
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-black dark:text-white">{contact.name}</p>
                            </div>
                            <div className="col-span-3 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white">
                                    {contact.email}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{contact.report ? "TRUE" : "FALSE"}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{String(contact.attended).toUpperCase()}</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="text-sm text-black dark:text-white">{String(new Date(contact.createdAt).toLocaleDateString())}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Contacts;