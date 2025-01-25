import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInputWithIcon from '@/Components/TextInputWithIcon';
import { Head, Link, useForm } from '@inertiajs/react';
import { FiDatabase } from 'react-icons/fi';

export default function LoginTenant({ status}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        tenant_id: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tenant.login'));
    };

    return (
        <GuestLayout>
            <Head title="Tenant Login" />
            
            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
            
            <div className="flex">
                <div className="w-3/5 text-white flex flex-col p-12">
                    <h2 className="text-lg font-bold">スケジュール</h2>
                    <p className="text-lg text-blue-400 mb-8">管理パネル</p>
                    <p className="text-white mb-8">ワークスペースを持っていない方</p>
                    <Link
                        href={route('tenant.register')}
                        className="bg-white text-black text-center text-sm font-bold px-6 py-3 rounded-md hover:bg-gray-300 transition"
                    >
                        Create Workspace
                    </Link>
                </div>

                <div className="w-2/5 bg-white flex flex-col justify-center rounded-lg items-center">
                    <div className="w-full bg-white rounded-lg p-8">
                        <form onSubmit={submit}>
                            <h2 className="text-lg font-bold">ワークスペース</h2>
                            <div className='mt-8 mb-12'>
                                <TextInputWithIcon
                                    name="tenant_id"
                                    value={data.tenant_id}
                                    onChange={(e) => setData('tenant_id', e.target.value)}
                                    placeholder="Tenant ID"
                                    icon={FiDatabase} 
                                    error={errors.tenant_id} 
                                    className="text-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <PrimaryButton className="w-full px-6 py-2" disabled={processing}>
                                    Enter
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
