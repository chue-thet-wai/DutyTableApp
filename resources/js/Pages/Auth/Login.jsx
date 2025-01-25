import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInputWithIcon from '@/Components/TextInputWithIcon';
import { Head, Link, useForm } from '@inertiajs/react';
import { FiMail,FiLock } from 'react-icons/fi';
import { usePage } from '@inertiajs/react';

export default function Login({ status }) {
    const { tenant } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const handleBack = (e) => {
        e.preventDefault(); 
        window.location.href = route('tenant.login'); 
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            
            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
            
            <div className="flex">
                <div className="w-3/5 text-white flex flex-col p-12">
                    <h2 className="text-lg font-bold">スケジュール</h2>
                    <p className="text-lg text-blue-400 mb-8">管理パネル</p>
                    <hr className='bg-gray-900 mt-4 mb-4' />
                    <h2 className="text-lg font-bold mt-4 text-center">{tenant.company_name || 'Company Name'}</h2>
                </div>

                <div className="w-2/5 bg-white flex flex-col justify-center rounded-lg items-center">
                    <div className="w-full bg-white rounded-lg p-8">
                        <form onSubmit={submit}>
                            <h2 className="text-lg font-bold">ユーザーID</h2>
                            <div className='mt-8 mb-4'>
                                <TextInputWithIcon
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    autoComplete="email"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email"
                                    icon={FiMail} 
                                    error={errors.email} 
                                    className="text-sm"
                                />
                            </div>
                            <div className='mb-8'>
                                <TextInputWithIcon
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    icon={FiLock} 
                                    error={errors.password} 
                                    className="text-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between mt-4 space-x-2">
                                <PrimaryButton className="w-1/3 bg-gray-700 hover:bg-gray-600" 
                                    onClick={handleBack} 
                                    disabled={processing}>
                                    Back
                                </PrimaryButton>
                                <PrimaryButton className="w-2/3" disabled={processing}>
                                    Login
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
