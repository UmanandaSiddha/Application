import DefaultLayout from "../../layout/DefaultLayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ICard } from "../../types/type";
import API from "../../config/apiConfig";

type TypeOptions = "ALL"
	| "BOTANICAL"
	| "INDIVIDUAL"
	| "MEDICAL"
	| "CREATOR"
	| "ANIMAL";

export interface FetchUserCardsResponse {
    success: boolean;
    count: number;
    resultPerPage: number;
    cards: ICard[];
    filteredCardsCount: number;
}

const Cards = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const paramsType = (searchParams.get("type") as TypeOptions) || "ALL";
    const [type, setType] = useState<TypeOptions>(paramsType);
	const [cards, setCards] = useState<ICard[]>();
	const [counts, setCounts] = useState({
		currentPage: Number(searchParams.get("currentPage")) || 1,
        resultPerPage: 20,
        filteredCards: 1,
        totalCards: 1
	});
	const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
	const [loading, setLoading] = useState(false);

	const fetchCards = async (url: string) => {
		try {
			const { data }: { data: FetchUserCardsResponse } = await API.get(url);
			setCards(data.cards);
			setCounts(prev => ({
                ...prev,
                resultPerPage: data.resultPerPage,
                filteredCards: data.filteredCardsCount,
                totalCards: data.count
            }));
		} catch (error: any) {
			toast.error(error.response.data.message);
			setCards([]);
		}
	};

	useEffect(() => {
		const queryParams = [
            `page=${counts.currentPage}`,
            `type=${type}`,
            `keyword=${keyword}`
        ].filter(Boolean).join("&");

		setLoading(true);

		setCards([]);

		if (type && ["ALL", "BOTANICAL", "INDIVIDUAL", "MEDICAL", "CREATOR", "ANIMAL"].includes(type)) {
			const link = `/admin/cards/all?${queryParams}`;
			fetchCards(link);
		}

		setLoading(false);

	}, [type, counts.currentPage]);

	const debounceFetch = (callback: () => void, delay: number) => {
        // let timeout: NodeJS.Timeout;
		let timeout: ReturnType<typeof setTimeout>
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(callback, delay);
        };
    };

	useEffect(() => {
        setLoading(true);
        const debouncedSearch = debounceFetch(() => {
            setCounts(prev => ({ ...prev, currentPage: 1 }));
            fetchCards(`/admin/cards/all?page=1&type=${type}&keyword=${keyword}`);
            setSearchParams(prev => {
                prev.set("keyword", keyword);
                prev.set("currentPage", "1");
                return prev;
            }, { replace: true });
            setLoading(false);
        }, 2000);
        debouncedSearch();
    }, [keyword]);

	useEffect(() => {
        if (counts.currentPage || type) {
            setSearchParams(prev => {
                prev.set("currentPage", counts.currentPage.toString());
                prev.set("type", type);
                return prev;
            }, { replace: true });
        }
    }, [counts.currentPage, type]);

	return (
		<DefaultLayout>
			<div className="flex flex-col gap-10">
				<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-4 md:px-6 xl:px-7.5">
						<h4 className="text-xl font-semibold text-black dark:text-white">
							Cards ( {counts.totalCards} )
						</h4>
						<div className="flex items-center justify-center">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setCounts({ ...counts, currentPage: 1 });
                                }}
                                placeholder="Search Card..."
                                className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"
                            />
                        </div>
						<div className="flex items-center justify-center">
							<select
								className="text-black px-3 py-2 rounded-md"
								value={type}
								onChange={(e) => {
									setType(e.target.value as TypeOptions);
									setSearchParams({ type: e.target.value as TypeOptions }, { replace: true });
								}}
							>
								<option value="ALL">All</option>
								<option value="BOTANICAL">Botanical</option>
								<option value="ANIMAL">Animal</option>
								<option value="MEDICAL">Medical</option>
								<option value="CREATOR">Creator</option>
								<option value="INDIVIDUAL">Individual</option>
							</select>
						</div>
						<div className="flex justify-center items-center space-x-4">
							<button
								onClick={() => setCounts({ ...counts, currentPage: counts.currentPage - 1 })}
								disabled={counts.currentPage === 1}
								className="bg-slate-600 text-white py-2 px-4 rounded-md"
							>
								Prev
							</button>
							<p className="text-md font-semibold truncate">
								{counts.currentPage} / {Math.ceil(counts.filteredCards / counts.resultPerPage)}
							</p>
							<button
								onClick={() => setCounts({ ...counts, currentPage: counts.currentPage + 1 })}
								disabled={counts.currentPage >= Math.ceil(counts.filteredCards / counts.resultPerPage)}
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
						<div className="col-span-1 hidden items-center sm:flex">
							<p className="font-medium">Card Type</p>
						</div>
						<div className="col-span-2 hidden items-center sm:flex">
							<p className="font-medium">Short Code</p>
						</div>
						<div className="col-span-1 hidden items-center sm:flex">
							<p className="font-medium">Created</p>
						</div>
						<div className="col-span-2 flex items-center">
							<p className="font-medium">Creator</p>
						</div>
					</div>

					{loading ? (
						<div className="flex justify-center items-center border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
							<div
								className={`h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent`}
							></div>
						</div>
					) : cards && cards.length > 0 ? (
						<>
							{cards?.map((card, key) => (
								<div
									className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
									key={key}
									onClick={() => navigate(`/cards/details?id=${card._id}&type=${card.type}`)}
								>
									<div className="col-span-2 flex items-center">
										<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
											<p className="text-sm text-black dark:text-white">
												{card.data.name || "Unknown Name"}
											</p>
										</div>
									</div>
									<div className="col-span-1 hidden items-center sm:flex">
										<p className="text-sm text-black dark:text-white">
											{card.type}
										</p>
									</div>
									<div className="col-span-2 hidden items-center sm:flex">
										<p className="text-sm text-black dark:text-white">
											{card.shortCode}
										</p>
									</div>
									<div className="col-span-1 hidden items-center sm:flex">
										<p className="text-sm text-black dark:text-white">
											{String(new Date(card.createdAt).toLocaleDateString())}
										</p>
									</div>
									<div className="col-span-2 flex items-center">
										<p
											className="text-sm text-meta-3 cursor-pointer"
											onClick={(e) => {
												e.stopPropagation();
												navigate(`/users/details?id=${card.userId?._id}`);
											}}
										>
											{card.userId.profile.email}
										</p>
									</div>
								</div>
							))}
						</>
					) : (
						<div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
							<p className="text-xl font-semibold capitalize">
								No card here
							</p>
						</div>
					)}
				</div>
			</div>
		</DefaultLayout>
	);
};

export default Cards;
