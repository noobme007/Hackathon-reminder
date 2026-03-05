import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import HackathonCard from '../components/HackathonCard';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
    const [hackathons, setHackathons] = useState([]);
    const [filteredHackathons, setFilteredHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('active');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('deadline');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const fetchHackathons = async () => {
        try {
            const { data } = await API.get('/hackathons');
            setHackathons(data);
            filterHackathons(data, 'active', '', 'deadline');
        } catch (error) {
            console.error("Failed to fetch hackathons", error);
        } finally {
            setLoading(false);
        }
    };

    const filterHackathons = (hacks, type, search, sort) => {
        let filtered = [...hacks];
        const now = new Date();

        // Type filter
        if (type === 'active') {
            filtered = filtered.filter(h => new Date(h.registrationDeadline) > now);
        } else if (type === 'completed') {
            filtered = filtered.filter(h => new Date(h.registrationDeadline) <= now);
        }

        // Search filter
        if (search.trim()) {
            filtered = filtered.filter(h =>
                h.name.toLowerCase().includes(search.toLowerCase()) ||
                h.category?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Sort
        if (sort === 'deadline') {
            filtered.sort((a, b) => new Date(a.registrationDeadline) - new Date(b.registrationDeadline));
        } else if (sort === 'priority') {
            const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
            filtered.sort((a, b) => (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999));
        } else if (sort === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredHackathons(filtered);
    };

    useEffect(() => {
        fetchHackathons();
    }, []);

    useEffect(() => {
        filterHackathons(hackathons, filterType, searchTerm, sortBy);
    }, [filterType, searchTerm, sortBy, hackathons]);

    const handleDeleteClick = (id) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;

        try {
            await API.delete(`/hackathons/${deleteTargetId}`);
            setHackathons(hackathons.filter(h => h._id !== deleteTargetId));
        } catch (e) {
            console.error("Failed to delete", e);
            alert('Failed to delete hackathon');
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteTargetId(null);
        }
    };

    // Calculate stats
    const now = new Date();
    const activeCount = hackathons.filter(h => new Date(h.registrationDeadline) > now).length;
    const completedCount = hackathons.filter(h => new Date(h.registrationDeadline) <= now).length;
    const highPriority = hackathons.filter(h => h.priority === 'Critical' || h.priority === 'High').length;

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your hackathons...</p>
            </div>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage and track your hackathon deadlines</p>
                    </div>
                    <Link to="/add" className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>Add Hackathon</span>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Hackathons</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{hackathons.length}</p>
                            </div>
                            <svg className="h-12 w-12 text-indigo-600 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Active</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
                            </div>
                            <svg className="h-12 w-12 text-green-600 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Completed</p>
                                <p className="text-3xl font-bold text-gray-600 mt-2">{completedCount}</p>
                            </div>
                            <svg className="h-12 w-12 text-gray-600 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.27c-.047.904-.5 1.75-1.254 2.386a3.957 3.957 0 01-.643.361 3.957 3.957 0 002.811 3.051 3.957 3.957 0 01-2.112 1.694 3.957 3.957 0 002.812 3.27 3.066 3.066 0 01-2.812 3.27 3.066 3.066 0 01-1.745-.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 01-1.745.723 3.066 3.066 0 01-2.812-3.27 3.957 3.957 0 01.643-.361 3.957 3.957 0 01-.643-.361 3.957 3.957 0 01-2.811-3.051 3.957 3.957 0 002.112-1.694 3.957 3.957 0 01-2.812-3.27 3.066 3.066 0 012.812-3.27z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">High Priority</p>
                                <p className="text-3xl font-bold text-red-600 mt-2">{highPriority}</p>
                            </div>
                            <svg className="h-12 w-12 text-red-600 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Search by name or category..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="active">Active Only</option>
                            <option value="completed">Completed</option>
                            <option value="all">All</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="deadline">Deadline (Nearest)</option>
                            <option value="priority">Priority</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterType('active');
                                setSortBy('deadline');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Hackathons List */}
            {filteredHackathons.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center border-2 border-dashed border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900">No hackathons found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your filters or add a new hackathon</p>
                    <div className="mt-6">
                        <Link to="/add" className="text-indigo-600 font-medium hover:text-indigo-500">
                            Create a new hackathon &rarr;
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHackathons.map(h => (
                        <HackathonCard key={h._id} hackathon={h} onDelete={handleDeleteClick} />
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Hackathon?"
                message="Are you sure you want to remove this hackathon? This action will permanently delete the reminder and cannot be undone."
                confirmText="Yes, Delete it"
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                type="danger"
            />

            <div className="mt-8 text-center text-gray-600 text-sm">
                Showing {filteredHackathons.length} of {hackathons.length} hackathons
            </div>
        </div>
    );
};

export default Dashboard;
