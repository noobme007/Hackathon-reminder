import { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const AddHackathon = () => {
    const [name, setName] = useState('');
    const [regDate, setRegDate] = useState('');
    const [pptDate, setPptDate] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await API.post('/hackathons', {
                name,
                registrationDeadline: regDate,
                pptDeadline: pptDate
            });
            navigate('/');
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || 'Failed to add hackathon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Add New Hackathon
                    </h2>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
                {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hackathon Name</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="e.g. HackMIT 2026"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                            <div className="mt-1">
                                <input
                                    type="datetime-local"
                                    required
                                    className="input-field"
                                    value={regDate}
                                    onChange={e => setRegDate(e.target.value)}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Date & Time for registration closing</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">PPT / Submission Deadline</label>
                            <div className="mt-1">
                                <input
                                    type="datetime-local"
                                    required
                                    className="input-field"
                                    value={pptDate}
                                    onChange={e => setPptDate(e.target.value)}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Date & Time for final submission</p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Link
                            to="/"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Saving...' : 'Save Hackathon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHackathon;
