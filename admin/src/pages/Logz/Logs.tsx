import DefaultLayout from '../../layout/DefaultLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

type LogData = {
    id: number;
    data: {
        timestamp: string;
        tag: string;
        level: string;
        description: string;
    }
}

type LogResponse = {
    success: boolean;
    data: LogData[];
}

const Logs = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [logData, setLogData] = useState<LogData[]>([]);
    const typeParams = searchParams.get('type');
    const [type, setType] = useState<"info" | "error">((typeParams as "info" | "error") || "info");
    const [loading, setLoading] = useState(false);

    const fetchLogs = async (url: string) => {
        try {
            const { data }: { data: LogResponse } = await axios.get(url, { withCredentials: true });
            setLogData(data.data);
            const payload = {
                type,
                data: data.data,
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('logs', JSON.stringify(payload));
        } catch (error: any) {
            toast.error(error.response.data.message);
            setLogData([]);
            const payload = {
                type,
                data: [],
                expires: Date.now() + 60 * 1000
            }
            window.sessionStorage.setItem('logs', JSON.stringify(payload));
        }
    }

    useEffect(() => {
        setLoading(true);

        const delayDebounce = setTimeout(() => {

            const cachedLogs = window.sessionStorage.getItem('logs');
            if (cachedLogs) {
                const { data, expires, type: cachedType } = JSON.parse(cachedLogs);

                if (Date.now() < expires && cachedType === type) {
                    setLogData(data);
                    setLoading(false);
                    return;
                }
            }

            let link = `${import.meta.env.VITE_BASE_URL}/admin/logs/info`;
            if (type === "error") {
                link = `${import.meta.env.VITE_BASE_URL}/admin/logs/error`;
            }
            fetchLogs(link);
            setLoading(false);
        }, 1000);


        return () => clearTimeout(delayDebounce);
    }, [type]);

    const handleDeleteLog = async () => {
        if (logData?.length === 0) {
            toast.warning("No logs to delete");
            return;
        }
        let link = `${import.meta.env.VITE_BASE_URL}/admin/logs/info`;
        if (type === "error") {
            link = `${import.meta.env.VITE_BASE_URL}/admin/logs/error`;
        }
        try {
            const { data }: { data: any } = await axios.delete(link, { withCredentials: true });
            window.sessionStorage.removeItem('logs');
            setLogData([]);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
                        <h4 className="text-xl capitalize font-semibold text-black dark:text-white">
                            {type} Logs
                        </h4>
                        <div className="flex items-center justify-center space-x-4">
                            <button className='text-white bg-red-500 px-3 py-2 rounded-md' onClick={handleDeleteLog} disabled={!type}>Delete Log</button>
                            <select
                                className="text-black px-3 py-2 rounded-md"
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value as "info" | "error");
                                    setSearchParams({ type: e.target.value as "info" | "error" }, { replace: true });
                                }}
                            >
                                <option value="info">Info</option>
                                <option value="error">Error</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
                            <div className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}></div>
                        </div>
                    ) : logData.length > 0 ? (
                        <>
                            {logData.map((log, key) => (
                                <div
                                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                                    key={key}
                                >
                                    <div className="col-span-1 flex items-center">
                                        <p className="text-sm text-black dark:text-white">{log.id}</p>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        <p className="text-sm text-black dark:text-white">{log.data.timestamp}</p>
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        <p className="text-sm text-black dark:text-white">[{log.data.tag}]</p>
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        <p className="text-sm text-black dark:text-white">{log.data.level}</p>
                                    </div>
                                    <div className="col-span-3 flex items-center">
                                        <p className="text-sm text-black dark:text-white">{log.data.description}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                            <p className='text-xl font-semibold capitalize'>No {type} log</p>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Logs