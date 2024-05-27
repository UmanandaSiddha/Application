import { User } from "../../types/types";
import { useNavigate } from "react-router-dom";

type PropTypes = {
    users: User[]
}

const UserTable = ({users}: PropTypes) => {

    const navigate = useNavigate();

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    All Users
                </h4>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">Name</p>
                </div>
                <div className="col-span-3 hidden items-center sm:flex">
                    <p className="font-medium">Email</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Role</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Account</p>
                </div>
            </div>

            {users?.map((user, key) => (
                <div
                    className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                    onClick={() => navigate(`/user-details?id=${user._id}`)}
                >
                    <div className="col-span-3 flex items-center">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="h-12.5 w-15 rounded-md hidden items-center sm:flex">
                                <img className="h-15 w-15 rounded-full" src={user.image} alt={user.name} />
                            </div>
                            <p className="text-sm text-black dark:text-white">
                                {user.name}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-3 hidden items-center sm:flex">
                        <p className="text-sm text-black dark:text-white">
                            {user.email}
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">{user.role.toUpperCase()}</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-meta-3">{user.accountType.toUpperCase()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserTable;
