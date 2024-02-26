import { User } from "@/types/types";
import { useNavigate } from "react-router-dom";

interface PropsType {
    user: User | null;
}

const Home = ({ user }: PropsType) => {

    const navigate = useNavigate();

    return (
        <div className="bg-white">
            <div className="relative isolate px-6 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-24">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                            Announcing our next round of funding.{' '}
                            <a href="#" className="font-semibold text-indigo-600">
                                <span className="absolute inset-0" aria-hidden="true" />
                                Read more <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Data to enrich your online business
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Officia excepturi dolores corporis mollitia perferendis accusamus magni eligendi modi a maxime.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                onClick={() => navigate(user ? "/dashboard" : "/login")}
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
                            </button>
                            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                                Testing 2 <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;