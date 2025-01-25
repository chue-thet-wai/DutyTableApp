import { useEffect, useState } from 'react';
import moment from 'moment';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { FiSearch,FiPlus } from 'react-icons/fi';
import { GrFormNext } from 'react-icons/gr'
import { FaFileExport } from "react-icons/fa6";
import TextInputWithIcon from '@/Components/TextInputWithIcon';
import SelectWithIcon from '@/Components/SelectWithIcon';
import PrimaryButton from '@/Components/PrimaryButton';

export default function UserList({ usersList , positions }) {
    const { tenant } = usePage().props;
    const [users, setUsers] = useState(usersList.data);
    const [pagination, setPagination] = useState({
        currentPage: usersList.current_page,
        lastPage: usersList.last_page,
    });
    const [totalUsers, setTotalUsers] = useState(usersList.total);
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const pageOptions = [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '50', label: '50' },
        { value: '100', label: '100' },
    ];

    useEffect(() => {
        fetchUsers();
    }, [search, perPage]);

    const fetchUsers = async (page = 1) => {
        //setLoading(true);
        try {
            const response = await fetch(
                `/filter_users?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`
            );
            if (response.ok) {
                const data = await response.json();
                setUsers(data.data);
                setPagination({
                    currentPage: data.current_page,
                    lastPage: data.last_page,
                });
                setTotalUsers(data.total);
            } else {
                console.error('Error fetching users:', error);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } 
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value)); 
    };

    const exportData = async () => {
        try {
            const response = await fetch('/export-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'), 
                },
                body: JSON.stringify({ selectedUsers }),
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'userslist_export.csv'; 
                link.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Error exporting data');
            }
            
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };
    

    const handlePagination = (page) => {
        fetchUsers(page);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map((user) => user.id)); 
        } else {
            setSelectedUsers([]); 
        }
    };

    const handleUserSelect = (e, userId) => {
        if (e.target.checked) {
            setSelectedUsers((prevSelected) => [...prevSelected, userId]);
        } else {
            setSelectedUsers((prevSelected) =>
                prevSelected.filter((id) => id !== userId)
            );
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        window.location.href = '/users/create'; 
    };

    return (
        <AuthenticatedLayout>
            <Head title="User List" />

            <div className="w-full min-h-screen bg-white shadow-lg rounded-lg p-6">
                {/* Filter */}
                <div className="flex items-center justify-between mb-8 space-x-4">
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600 mx-4">
                            Total Users: <span className="font-semibold">{totalUsers}</span>
                        </div>

                        <div className="flex text-sm text-gray-600 items-center space-x-2">
                            <span className="font-semibold">Show</span>
                            <SelectWithIcon
                                name="perpage"
                                value={perPage}
                                onChange={handlePerPageChange}
                                options={pageOptions} 
                                className="text-sm px-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 w-1/3">
                        <TextInputWithIcon
                            name="name"
                            value={search}
                            onChange={handleSearch}
                            icon={FiSearch}
                            className="text-sm"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <PrimaryButton 
                            onClick={handleCreate}
                            className="bg-primary-color hover:bg-secondary-color text-white my-2"
                        >
                            <FiPlus className='text-lg font-bold text-white' /> <span className="mx-2 font-bold">Create</span>
                        </PrimaryButton>
                        <button
                            onClick={exportData}
                            className="flex items-center px-4 py-2 bg-white text-black text-2xl rounded-md hover:text-gray-300 transition"
                        >
                            <FaFileExport className="mr-2" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <div className="relative max-h-96 overflow-y-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100 top-0 z-10">
                                <tr>
                                    <th className="p-2 text-left text-sm font-semibold text-gray-700">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedUsers.length === users.length}
                                        />
                                    </th>
                                    <th className="p-2 text-left text-sm font-semibold text-gray-700 w-[300px]">
                                        <div className="flex flex-col items-start space-y-1">
                                            <span className="text-gray-700 text-sm">User ID</span>
                                            <span className="text-gray-700">Name</span>
                                        </div>
                                    </th>
                                    <th className="p-2 text-left text-sm font-semibold text-gray-700">Postition</th>
                                    <th className="p-2 text-left text-sm font-semibold text-gray-700">User Role</th>
                                    <th className="p-2 text-left text-sm font-semibold text-gray-700">
                                        <div className="flex flex-col items-start space-y-1">
                                            <span className="text-gray-700 text-sm">Register</span>
                                            <span className="text-gray-700">Date&Time</span>
                                        </div>
                                    </th>
                                    <th className="p-2 text-left text-sm font-semibold text-gray-700"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center p-4">
                                            <div>Loading...</div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 transition duration-200 border-b"
                                        >
                                            <td className="p-2 text-sm font-medium text-gray-700">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={(e) => handleUserSelect(e, user.id)}
                                                />
                                            </td>
                                            <td className="p-2 text-sm font-medium text-gray-700 flex items-center space-x-4 w-[300px]">
                                                <div className="flex flex-col items-start w-2/3">
                                                    <span className="text-gray-500 text-sm">{user.user_id}</span>
                                                    <span className="text-gray-700 font-semibold">{user.name}</span>
                                                </div>
                                                <img
                                                    src={user.profile ? `/images/profiles/${tenant.id}/${user.profile}` : '/no_profile.jpg'}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full object-cover mt-2"
                                                />
                                            </td>

                                            <td className="p-2 text-sm font-medium text-gray-700">
                                                {positions[user.position] || 'Unknown'}
                                            </td>
                                            <td className="p-2 text-sm font-medium text-gray-700">{user.roles?.[0]?.name || "No Role"}</td>
                                            <td className="p-2 text-sm font-medium text-gray-700">
                                                <div className="flex flex-col items-start w-2/3">
                                                    <span className="text-gray-700 text-sm">{moment(user.created_at).format('YYYY-MM-DD')}</span>
                                                    <span className="text-gray-500 text-sm">{moment(user.created_at).format('HH:mm')}</span>
                                                </div>
                                            </td>
                                            <td className="p-2 text-sm font-medium text-gray-700">
                                                <Link
                                                    href={`/users/${user.id}/edit`}
                                                    className="bg-gray-700 hover:bg-gray-200 mr-2 transition"
                                                >
                                                    <GrFormNext className='text-3xl'/>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-end mt-4 space-x-2">
                    {[...Array(pagination.lastPage)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePagination(index + 1)}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                                pagination.currentPage === index + 1
                                    ? 'bg-primary-color text-white'
                                    : 'bg-gray-100 text-primary-color hover:bg-gray-200'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
