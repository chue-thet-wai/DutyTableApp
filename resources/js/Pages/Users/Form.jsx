import { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInputWithIcon from '@/Components/TextInputWithIcon';
import ImageUpload from '@/Components/ImageUpload';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectWithIcon from '@/Components/SelectWithIcon';
import Modal from '@/Components/Modal';

export default function UserForm({ positions=[],user = null }) {
    const { tenant } = usePage().props;
    const isEdit = !!user; 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { data, setData, post, errors, processing } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        position: user?.position || '',
        role: user?.roles?.[0]?.name || 'User',
        password: '',
        profile: user?.profile?`/images/profiles/${tenant.id}/${user.profile}` : '/no_profile.jpg',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('users.update_user', user.id), {
                onSuccess: () => console.log('User updated!'),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => console.log('User created!'),
            });
        }
    };

    const confirmDelete = async () => {    
        try {
            const response = await fetch(`/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'), 
                },
            });
    
            if (response.ok) {
                window.location.href = '/users'; 
            } else {
                setShowDeleteModal(false)
                console.error('Error deleting user');
            }
        } catch (error) {
            setShowDeleteModal(false)
            console.error('There was an error with the fetch request:', error);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault(); 
        window.location.href = '/users'; 
    };

    const clickDelete = (e) => {
        e.preventDefault(); 
        setShowDeleteModal(true);
    };
    

    return (
        <AuthenticatedLayout>
            <Head title={isEdit ? "Edit User" : "Add User"} />
            <div className="flex items-center justify-center bg-white rounded-lg p-6">
                <div className="p-6 md:p-8 w-full max-w-4xl">
                    <h2 className="text-2xl font-bold mb-6">
                        {isEdit ? 'Edit User' : 'Add User'}
                    </h2>
                    <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">

                            <div className="flex items-center space-x-4">
                                <InputLabel htmlFor="name" value="Name" className="w-1/4" />
                                <TextInputWithIcon
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Name"
                                    error={errors.name}
                                    className="w-3/4 text-sm"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <InputLabel htmlFor="email" value="Email" className="w-1/4" />
                                <TextInputWithIcon
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email"
                                    error={errors.email}
                                    className="w-3/4 text-sm"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <InputLabel htmlFor="position" value="Position" className="w-1/4" />
                                <SelectWithIcon
                                    name="position"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    options={positions}
                                    placeholder="Select Position"
                                    error={errors.position}
                                    className="w-3/4 text-sm"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <InputLabel htmlFor="password" value="Password" className="w-1/4" />
                                <TextInputWithIcon
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    error={errors.password}
                                    className="w-3/4 text-sm"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <InputLabel htmlFor="phone" value="Mobile No" className="w-1/4" />
                                <TextInputWithIcon
                                    name="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Mobile No"
                                    error={errors.phone}
                                    className="w-3/4 text-sm"
                                />
                            </div>
                            <div className="flex items-center space-x-4"></div>

                            <div className="flex items-center space-x-4 mt-4">
                                <InputLabel htmlFor="profile" value="Profile" className="w-1/4" />
                                <div className="mb-4">
                                    <ImageUpload
                                        value={data.profile}
                                        onChange={(file) => setData('profile', file)}
                                        placeholder="Upload Photo"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col p-4 m-4">
                                <label className="flex">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Administrator"
                                        checked={data.role === 'Administrator'}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="form-radio"
                                    />
                                    <span className="ml-4">Administrator</span>
                                </label>
                                <label className="flex">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="User"
                                        checked={data.role === 'User'}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="form-radio"
                                    />
                                    <span className="ml-4">User</span>
                                </label>
                            </div>

                            {isEdit && (
                                <div className="mt-8">
                                    <PrimaryButton
                                        className="px-6 bg-red-600 hover:bg-red-700"
                                        onClick={clickDelete}
                                    >
                                        Delete
                                    </PrimaryButton>
                                </div>
                            )}
                            <div className="flex space-x-4 mt-8">
                                <PrimaryButton
                                    className="px-6 bg-gray-500 hover:bg-gray-600"
                                    disabled={processing}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </PrimaryButton>

                                <PrimaryButton
                                    className="px-12"
                                    disabled={processing}
                                >
                                    {isEdit ? 'Update' : 'Register'}
                                </PrimaryButton>
                            </div>
                        </div>
                        {showDeleteModal && (
                            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                                    <p className="mb-6">Are you sure you want to delete this profile?</p>
                                    <div className="flex justify-end space-x-4">
                                        <PrimaryButton
                                            className="bg-gray-500 hover:bg-gray-600"
                                            onClick={() => setShowDeleteModal(false)}
                                        >
                                            Cancel
                                        </PrimaryButton>
                                        <PrimaryButton
                                            className="bg-red-500 hover:bg-red-600"
                                            onClick={confirmDelete}
                                        >
                                            Delete
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </Modal>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
