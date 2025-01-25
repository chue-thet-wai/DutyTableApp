import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInputWithIcon from '@/Components/TextInputWithIcon';
import SelectWithIcon from '@/Components/SelectWithIcon';
import { Head, Link, useForm } from '@inertiajs/react';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';

const LoadingCard = () => {
    return (
        <div className="flex items-center justify-center p-6 w-90 h-30">
            <div className="flex flex-col items-center space-y-4">
                <h3 className="text-2xl text-primary-color font-bold">ワークスペース・環境を登録しています。</h3>
                <div className="flex space-x-2">
                    <span className="h-5 w-5 bg-primary-color rounded-full animate-bounce"></span>
                    <span className="h-5 w-5 bg-primary-color rounded-full animate-bounce delay-150"></span>
                    <span className="h-5 w-5 bg-primary-color rounded-full animate-bounce delay-300"></span>
                    <span className="h-5 w-5 bg-primary-color rounded-full animate-bounce delay-450"></span>
                </div>
            </div>
        </div>
    );
};

export default function Register({ positions }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        position: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true); 
    
        post(route('register'), {
            onSuccess: () => {
                setTimeout(() => {
                    window.location.href = route('tenant.login');
                }, 3000); 
            },
            onError: () => {
                setLoading(false);
            },
        });
    };
    

    const handleBack = (e) => {
        e.preventDefault(); 
        window.location.href = '/tenant_register'; 
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="flex items-center justify-center bg-white rounded-lg p-6">
                {loading ? (
                    <LoadingCard />
                ) : (
                    <div className="p-6 md:p-8 w-1/2 max-w-lg">
                        <h2 className="text-2xl font-bold">管理者登録</h2>
                        <form onSubmit={submit} className="mt-6">
                            <div className="mb-4 mt-4">
                                <TextInputWithIcon
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="email"
                                    placeholder="Email"
                                    icon={FiMail}
                                    error={errors.email}
                                    className="text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <TextInputWithIcon
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    icon={FiLock}
                                    error={errors.password}
                                    className="text-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <TextInputWithIcon
                                    name="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Re-enter Password"
                                    autoComplete="confirm-password"
                                    error={errors.password_confirmation}
                                    className="text-sm ml-7"
                                />
                            </div>

                            <div className="mb-4">
                                <TextInputWithIcon
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Name"
                                    icon={FiUser}
                                    error={errors.name}
                                    className="text-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <SelectWithIcon
                                    name="position"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    placeholder="Position"
                                    error={errors.position}
                                    options={positions}
                                    className="text-sm ml-7"
                                />
                            </div>

                            <div className="mb-4">
                                <TextInputWithIcon
                                    name="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Phone"
                                    icon={FiPhone}
                                    error={errors.phone}
                                    className="text-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between space-x-2 mt-12">
                                <PrimaryButton
                                    className="w-1/3 bg-gray-700 hover:bg-gray-600"
                                    onClick={handleBack}
                                    disabled={processing}>
                                    Back
                                </PrimaryButton>

                                <PrimaryButton className="w-2/3" disabled={processing}>
                                    Register
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
