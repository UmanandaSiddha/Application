import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Loader = () => {
    return (
        <>
            <Helmet>
                <title>Voolata | Loading...</title>
                <meta name="description" content={`This page is loading`} />
                <meta name="keywords" content="loading, voolata" />
            </Helmet>
            <div className='flex flex-col justify-center gap-8 items-center mt-8'>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
            </div>
        </>
    )
}

export default Loader;