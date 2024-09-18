import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEffect, useState } from 'react';
import { Donator } from '../../types/types';
import { AllDonatorsResponse } from '../../types/api-types';
import axios from 'axios';
import { toast } from 'react-toastify';

const Donators = () => {

    const navigate = useNavigate();
    const [donators, setDonators] = useState<Donator[]>();
    const [keyword, setKeyword] = useState("");
    const [counts, setCounts] = useState({
        currentPage: 1,
        resultPerPage: 1,
        filteredDonators: 1,
        totalDonators: 1
    });
    const [loading, setLoading] = useState(false);

    const fetchDonators = async (url: string) => {
        try {
            const { data }: { data: AllDonatorsResponse } = await axios.get(url, { withCredentials: true });
            setDonators(data.donators);
            setCounts({
                ...counts,
                resultPerPage: data.resultPerPage,
                filteredDonators: data.filteredDonatorsCount,
                totalDonators: data.count
            });
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {

        setLoading(true);

        const delayDebounce = setTimeout(() => {
            let link = `${import.meta.env.VITE_BASE_URL}/admin/donator/all?keyword=${keyword}&page=${counts.currentPage}`;
            fetchDonators(link);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(delayDebounce);

    }, [keyword, counts.currentPage]);

    return (
        <DefaultLayout>
             <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Donators ( {keyword ? counts.filteredDonators : counts.totalDonators} )
                        </h4>
                        <div className="flex items-center justify-center">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setCounts({ ...counts, currentPage: 1 });
                                }}
                                placeholder="Search Donator..."
                                className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
                            />
                        </div>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
                                disabled={counts.currentPage === 1}
                                className="bg-slate-600 text-white py-2 px-4 rounded-md"
                            >
                                Prev
                            </button>
                            <p className="text-md font-semibold truncate">{counts.currentPage} / {Math.ceil(counts.filteredDonators / counts.resultPerPage)}</p>
                            <button
                                onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
                                disabled={counts.currentPage === Math.ceil(counts.filteredDonators / counts.resultPerPage)}
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
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="font-medium">Email</p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Phone</p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Pan</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                            <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                        </div>
                    ) : (
                        <>
                            {donators?.map((donator, key) => (
                                <div
                                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                    key={key}
                                    onClick={() => navigate(`/donators/details?id=${donator._id}`)}
                                >
                                    <div className="col-span-2 flex items-center">
                                        <p className="text-sm text-black dark:text-white">{donator.name}</p>
                                    </div>
                                    <div className="col-span-2 hidden items-center sm:flex">
                                        <p className="text-sm text-black dark:text-white">
                                            {donator.email}
                                        </p>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        <p className="text-sm text-black dark:text-white">{donator.phone}</p>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        <p className="text-sm text-meta-3">{donator?.pan}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Donators