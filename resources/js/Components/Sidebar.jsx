import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { FiX } from 'react-icons/fi';
import { PiUsersThreeFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";

export default function Sidebar({ showingSidebar, setShowingSidebar }) {
    const { roles } = usePage().props;
    const { url } = usePage(); 
    const [activeLink, setActiveLink] = useState('');
    const userRole = roles?.[0]?.name || 'No Role';


    let menuItems = [
        { name: 'Duty Tables', icon: <RxDashboard />, href: route('duty_tables.index') },
    ];
    
    if (userRole === 'Administrator') {
        menuItems = [
            ...menuItems,
            { name: 'Users List', icon: <PiUsersThreeFill />, href: route('users.index') }
        ];
    }

    
    useEffect(() => {
        const currentPath = window.location.href; 
        setActiveLink(currentPath);
    }, [url]);

    return (
        <div
            className={`${
                showingSidebar ? 'w-64' : 'w-20'
            } h-full bg-primary-color border-r border-primary-color transition-all duration-300 fixed top-0 left-0 flex flex-col`}
        >
            <div className="flex justify-between items-center p-4">
                <Link href="/" className="flex items-center space-x-2">
                    <ApplicationLogo className="block h-10 w-auto fill-current text-white px-2" />
                    {showingSidebar && 
                        <div className="text-white px-6 text-center">
                            <span className="font-bold block">スケジュール</span>
                            <span className="font-medium block text-secondary-color">管理パネル</span>
                        </div>
                    }
                </Link>

                {showingSidebar && (
                    <button
                        onClick={() => setShowingSidebar(false)}
                        className="text-xl text-gray-500 lg:hidden"
                    >
                        <FiX />
                    </button>
                )}
            </div>

            <nav className="flex-1 space-y-4 mt-4">
                {menuItems.map((item, index) => {
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            method={item.method || 'get'}
                            className={`flex items-center p-3 text-white transition-all duration-300 
                                ${activeLink === item.href 
                                    ? 'bg-gray-800 border-r-8 border-secondary-color' 
                                    : 'hover:bg-gray-800'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="text-xl mx-2">{item.icon}</div>
                                {showingSidebar && <span className="text-sm font-medium">{item.name}</span>}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
