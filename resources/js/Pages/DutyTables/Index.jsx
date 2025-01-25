import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import 'react-calendar/dist/Calendar.css';
import { FiSearch } from 'react-icons/fi';
import { LuCalendarDays } from "react-icons/lu";
import MultiDateSelect from '@/Components/MultiDateSelect';
import TextInputWithIcon from '@/Components/TextInputWithIcon';
import PrimaryButton from '@/Components/PrimaryButton';

export default function DutyTable({ usersList, month, year,isAdmin }) {
    const { tenant } = usePage().props;
    const [dutyAssignments, setDutyAssignments] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date(year, month - 1));
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState(usersList);

    const daysInMonth = currentDate ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() : 30;

    useEffect(() => {
        fetchData(searchQuery, currentDate.getMonth() + 1, currentDate.getFullYear());
    }, [searchQuery, currentDate]);

    const fetchData = async (searchQuery, month, year) => {
        //setLoading(true);
        try {
            const response = await fetch(`/filter_duty_tables?search=${searchQuery}&month=${month}&year=${year}`);
            const data = await response.json();
            const dutyAssignmentsByUserId = {};

            data.users.forEach(user => {
                dutyAssignmentsByUserId[user.id] = user.duty_dates.map(dateObj => dateObj.date);
            });

            setDutyAssignments(dutyAssignmentsByUserId);
        } catch (error) {
            console.error('Error fetching duty data:', error);
        } finally {
           // setLoading(false);
        }
    };

    const openCalendarModal = (userId) => {
        setSelectedUserId(userId);
        setSelectedDates(dutyAssignments[userId] || []);
        setShowModal(true);
    };

    const handleDateSelect = (dates) => {
        const selectedDatesFormatted = Array.isArray(dates) ? dates : [dates];
        setSelectedDates(selectedDatesFormatted);
    };

    const saveDutyDates = async () => {
        try{
            const response =await fetch('/save_duty_date', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    userId: selectedUserId,
                    dutyDates: selectedDates,
                }),
            })
    
            if (response.ok) {
                const data = await response.json();
                setDutyAssignments((prev) => ({
                    ...prev,
                    [selectedUserId]: selectedDates,
                }));
                setShowModal(false);
            } else {
                console.error('Error saving duty dates');
            }
        } catch (error) {
            console.error('Error saving duty dates:', error);
        }
    };

    const closeModalWithoutSaving = () => {
        setShowModal(false);
        setSelectedDates([]);
    };

    const handleMonthChange = (direction) => {
        const newDate = new Date(currentDate);
        if (direction === 'next') {
            newDate.setMonth(currentDate.getMonth() + 1);
        } else if (direction === 'prev') {
            newDate.setMonth(currentDate.getMonth() - 1);
        } else if (direction === 'current') {
            newDate.setFullYear(new Date().getFullYear());
            newDate.setMonth(new Date().getMonth());
        }
        setCurrentDate(newDate);
    };

    useEffect(() => {
        setFilteredUsers(
            usersList.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, usersList]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Duty Table" />
            <div className="w-full min-h-screen bg-white shadow-lg rounded-lg p-6">
                {/* Filter */}
                <div className="flex mb-8">
                    <div className="flex items-center">
                        <div className="ml-2 text-lg font-bold">
                            {`${String(currentDate.getMonth() + 1).padStart(2, '0')} / ${currentDate.getFullYear()}`}
                        </div>
                        <button onClick={() => handleMonthChange('prev')} className="ml-8 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-l-md border border-gray-300">
                            &lt;
                        </button>
                        <button onClick={() => handleMonthChange('current')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 border border-gray-300">
                            Now
                        </button>
                        <button onClick={() => handleMonthChange('next')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-r-md border border-gray-300">
                            &gt;
                        </button>
                    </div>

                    <div className="mx-24 flex space-x-2 w-1/3">
                        <TextInputWithIcon
                            name="name"
                            value={searchQuery}
                            onChange={handleSearch}
                            icon={FiSearch}
                            className="text-sm"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="overflow-x-auto bg-white shadow-md">
                    <table className="table-fixed w-full border border-gray-300 border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 p-2 text-center text-lg font-semibold w-[300px]" rowSpan="2">
                                    Member : {usersList.length}
                                </th>
                                {[...Array(daysInMonth).keys()].map((day) => (
                                    <th key={`dayname-${day}`} className="border border-gray-300 p-2 text-center font-semibold w-[40px]">
                                        {new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1).toLocaleString('default', { weekday: 'short' })[0]}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                {[...Array(daysInMonth).keys()].map((day) => (
                                    <th key={`daynumber-${day}`} className="border border-gray-300 p-2 text-center font-semibold">
                                        {day + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={daysInMonth + 1} className="text-center p-4">
                                        <div>Loading...</div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="p-2 text-sm font-medium text-gray-700 flex items-center border-b border-gray-300 space-x-4 w-[300px]">
                                            <img
                                                src={user.profile ? `/images/profiles/${tenant.id}/${user.profile}` : '/no_profile.jpg'}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col w-3/4">
                                                <span className="text-gray-500 text-sm">{user.user_id}</span>
                                                <span className="text-gray-700 font-semibold">{user.name}</span>
                                            </div>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => openCalendarModal(user.id)}
                                                    className="text-2xl text-blue-500 hover:text-blue-700 bg-gray-200 p-2 rounded-lg"
                                                    title="Open Calendar"
                                                >
                                                    <LuCalendarDays className="text-2xl" />
                                                </button>
                                            )}
                                        </td>
                                        {[...Array(daysInMonth).keys()].map((day) => (
                                            <td
                                                key={day}
                                                className={`border border-gray-300 text-center p-2 ${
                                                    dutyAssignments[user.id]?.includes(
                                                        `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                                                            .toString()
                                                            .padStart(2, '0')}-${(day + 1).toString().padStart(2, '0')}`
                                                    )
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white'
                                                }`}
                                            ></td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>


                {/* Date Save */}
                {showModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-2xl border border-secondary-color border-2 shadow-lg w-1/4">
                            <MultiDateSelect
                                selectedDates={selectedDates}
                                onSelect={handleDateSelect}
                                className="duty-datepicker"
                                isFocused={true}
                            />
                            <div className="flex justify-between mt-4 space-x-4">
                                <PrimaryButton onClick={closeModalWithoutSaving} className="bg-gray-700 hover:bg-gray-500 focus:bg-gary-500 text-gray-800 py-2 px-4 w-1/2">
                                    Cancel
                                </PrimaryButton>
                                <PrimaryButton onClick={saveDutyDates} className="py-2 px-4 w-1/2">
                                    OK
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
