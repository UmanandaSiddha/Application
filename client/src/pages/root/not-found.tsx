import { Helmet } from "react-helmet-async";

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>Voolata | 404 Page Not Found</title>
                <meta name="description" content={`This is the 404 page of Voolata`} />
                <meta name="keywords" content="404, voolata" />
            </Helmet>
            <div className='flex my-auto justify-center items-center mt-10'>
                <img src="./404.jpg" alt="" />
            </div>
        </>
    )
}

export default NotFound;