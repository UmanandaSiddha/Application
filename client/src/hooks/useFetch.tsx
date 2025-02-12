import API from "@/config/apiConfig";
import { useState, useEffect } from "react";

const useFetch = <T,>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(url, { withCredentials: true });
                // if (!response.ok) throw new Error("Failed to fetch data");
                // const result = await response.json();
                setData(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;