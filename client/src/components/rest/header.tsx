import { Link } from "react-router-dom";
import { User } from "../../types/types";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenuDemo } from "./drop-down";

interface PropsType {
    user: User | null;
}

const Header = ({ user }: PropsType) => {

    return (
        <div className="flex flex-row justify-between items-center pt-4 px-10 mx-4">
            <Link to="/">LOGO</Link>
            {
                user ? (
                    <div className="flex items-center gap-5">
                        <p className="hidden sm:block">{user.name}</p>
                        <DropdownMenuDemo>
                            <Avatar>
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuDemo>
                    </div>
                ) : (
                    <div>
                        <Button><Link to="/login">Login</Link></Button>
                    </div>
                )
            }
        </div>
    );
};

export default Header;
