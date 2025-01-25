import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInputWithIcon from '@/Components/TextInputWithIcon';
import { Head, useForm } from '@inertiajs/react';
import { FiDatabase } from 'react-icons/fi';
import { BiBuildingHouse } from 'react-icons/bi';

export default function Register({ tenant }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        tenant_id   : tenant?.tenant_id || '',  
        company_name: tenant?.company_name || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tenant.register'));
    };

    const handleCancel = (e) => {
        e.preventDefault(); 
        window.location.href = '/tenant_login'; 
    };

    return (
        <GuestLayout>
            <Head title="Tenant Register" />
            <div className="flex items-center justify-center bg-white rounded-lg p-6">
                <div className="p-6 md:p-8 w-1/2 max-w-lg">
                    <h2 className="text-2xl font-bold">ワークスペース登録</h2>
                    <form onSubmit={submit} className="mt-6">                        
                        <div className='mb-4 mt-4'>
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
                        <div className='mb-4'>
                            <TextInputWithIcon
                                name="company_name"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                placeholder="Company Name"
                                icon={BiBuildingHouse}
                                error={errors.company_name}
                                className="text-sm"
                            />
                        </div>

                        <div className="flex items-center justify-between space-x-2 mt-24">
                            <PrimaryButton
                                className="w-1/3 bg-gray-700 hover:bg-gray-600"
                                onClick={handleCancel}
                                disabled={processing} >
                                Cancel
                            </PrimaryButton>
                            <PrimaryButton className="w-2/3" disabled={processing}>
                                Next
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
