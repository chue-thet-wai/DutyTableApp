import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div
            className="min-h-screen flex flex-col justify-center items-center bg-gray-100 bg-cover bg-center px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: "url('/login_background.jpg')" }}
        >

            <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl bg-primary-color shadow-lg rounded-lg">
                {children}
            </div>
        </div>
    );
}
