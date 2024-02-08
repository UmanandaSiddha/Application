const Home = () => {
    const currentHost = `${window.location.protocol}//${window.location.hostname}`;
    return (
        <div className='flex flex-col justify-center gap-8 items-center mt-8'>
            Landing Page {currentHost}
            <div className="space-y-4">
                <p className="text-xl font-semibold">Login or Register if not</p>
                <p className="text-xl font-semibold">Click on the avatar to navigate</p>
                <p className="text-md font-semibold">Active Links - </p>
                <p>Profile</p>
                <p>Dashboard</p>
                <p>Subscription</p>
                <p>Logout</p>
            </div>
        </div>
    )
}

export default Home;