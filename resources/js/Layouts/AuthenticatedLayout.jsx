import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import Dropdown from '@/Components/Dropdown';
import { usePage } from '@inertiajs/react';
import { AiOutlineMenu,AiOutlineLogout} from 'react-icons/ai';
import clsx from 'clsx'; 

export default function Authenticated({ authuser, children }) {
    const { auth } = usePage().props;
    const { roles } = usePage().props;
    const { tenant } = usePage().props;
    const user = authuser || auth.user;
    const userRole = roles?.[0]?.name || 'No Role';

    const [showingSidebar, setShowingSidebar] = useState(true);

    return (
        <div className="min-h-screen flex w-full bg-gray-100">
            <Sidebar showingSidebar={showingSidebar} setShowingSidebar={setShowingSidebar} />

            <div className={clsx("flex-1 transition-all duration-300",showingSidebar ? "ml-64" : "ml-20")}>
                <nav
                    className={`fixed top-0 z-20 bg-black border-b border-gray-100 transition-all duration-300 ${
                    showingSidebar ? 'w-[calc(100%-16rem)] left-64' : 'w-[calc(100%-5rem)] left-20'
                }`}>
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-left ml-2">
                                <button
                                    onClick={() => setShowingSidebar(!showingSidebar)}
                                    className="text-white text-2xl hover:text-gray-200 focus:outline-none"
                                >
                                    <AiOutlineMenu />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end items-center px-4">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex justify-end items-center space-x-2">
                                            <div className="hidden sm:flex flex-col text-sm text-white">
                                                <span>{user.name}</span>
                                                <span className="text-gray-400">{userRole || 'admin'}</span>
                                            </div>

                                            <img
                                                src={user.profile ? `/images/profiles/${tenant.id}/${user.profile}` : '/no_profile.jpg'}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover block"
                                            />
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content className="w-64">
                                        <div className="flex items-center space-x-4 p-4 bg-black text-white">
                                            <div className="flex flex-col text-sm">
                                                <span className="font-bold">{user.name}</span>
                                                <span className="text-gray-400">{userRole|| "No Role"}</span>
                                            </div>
                                            <img
                                                src={user.profile ? `/images/profiles/${tenant.id}/${user.profile}` : '/no_profile.jpg'}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        </div>

                                        <hr className="border-gray-300" />

                                        <div className="p-4 text-black text-center">
                                            <span className="font-semibold">{tenant.company_name || 'Company Name'}</span>
                                        </div>

                                        <hr className="border-gray-300" />

                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center justify-center space-x-2 w-full p-4 bg-black text-white hover:bg-gray-800"
                                        >
                                            <AiOutlineLogout />
                                            <span>Log Out</span>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="p-4 mt-16">
                    {children}
                </main>
            </div>
        </div>
    );
}
