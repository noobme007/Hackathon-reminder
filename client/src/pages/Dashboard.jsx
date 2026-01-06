import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import HackathonCard from '../components/HackathonCard';

const Dashboard = () => {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHackathons = async () => {
        try {
            const { data } = await API.get('/hackathons');
            setHackathons(data);
        } catch (error) {
            console.error("Failed to fetch hackathons", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHackathons();
    }, []);

    const deleteHackathon = async (id) => {
        if (!window.confirm('Are you sure you want to delete this hackathon?')) return;

        try {
            await API.delete(`/hackathons/${id}`);
            setHackathons(hackathons.filter(h => h._id !== id));
        } catch (e) {
            console.error("Failed to delete", e);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Your Hackathons</h1>
                    <p className="text-gray-500 mt-1">Manage your upcoming deadlines</p>
                </div>

                <Link to="/add" className="btn btn-primary shadow-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New
                </Link>
            </div>

            {hackathons.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center border-2 border-dashed border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900">No hackathons yet</h3>
                    <p className="mt-1 text-gray-500">Get started by creating a new hackathon.</p>
                    <div className="mt-6">
                        <Link to="/add" className="text-indigo-600 font-medium hover:text-indigo-500">
                            Create your first hackathon &rarr;
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hackathons.map(h => (
                        <HackathonCard key={h._id} hackathon={h} onDelete={deleteHackathon} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
