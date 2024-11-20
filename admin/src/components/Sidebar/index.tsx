import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
// import Logo from '../../images/logo/logo.svg';
import SideBarLink from './SideBarLink';
import GroupDropdown from './GroupDropdown';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector('body')?.classList.add('sidebar-expanded');
        } else {
            document.querySelector('body')?.classList.remove('sidebar-expanded');
        }
    }, [sidebarExpanded]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <NavLink to="/" className="flex gap-2">
                    <img className='h-8 w-8' src="https://merakiui.com/images/logo.svg" alt="Logo" />
                    <p className='text-2xl text-white font-bold'>VOOLATA ADMIN</p>
                </NavLink>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <svg
                        className="fill-current"
                        width="20"
                        height="18"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                            fill=""
                        />
                    </svg>
                </button>
            </div>

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                            MENU
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            <GroupDropdown
                                label='Dashboard'
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                pathArray={
                                    [
                                        {
                                            name: "Stats",
                                            link: "/"
                                        },
                                    ]
                                }
                            />
                            <GroupDropdown
                                label='Accounts'
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                pathArray={
                                    [
                                        {
                                            name: "Users",
                                            link: "/users"
                                        },
                                        {
                                            name: "Donators",
                                            link: "/donators"
                                        },
                                    ]
                                }
                            />
                            <GroupDropdown
                                label='Payments'
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                pathArray={
                                    [
                                        {
                                            name: "Plans",
                                            link: "/plans"
                                        },
                                        {
                                            name: "Subscriptions",
                                            link: "/subscriptions"
                                        },
                                        {
                                            name: "Transactions",
                                            link: "/transactions"
                                        }
                                    ]
                                }
                            />
                            <GroupDropdown
                                label='Messages'
                                sidebarExpanded={sidebarExpanded}
                                setSidebarExpanded={setSidebarExpanded}
                                pathArray={
                                    [
                                        {
                                            name: "Requests",
                                            link: "/requests"
                                        },
                                        {
                                            name: "Contacts",
                                            link: "/contacts"
                                        },
                                    ]
                                }
                            />

                            <SideBarLink path="/cards" label="Cards" />
                            <SideBarLink path='/logs' label="Logs" />
                            <SideBarLink path='/auth/signin' label="Sign In" />

                        </ul>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;