import { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const AddHackathon = () => {
    const [name, setName] = useState('');
    const [regDate, setRegDate] = useState('');
    const [pptDate, setPptDate] = useState('');
    const [includePpt, setIncludePpt] = useState(true);
    const [location, setLocation] = useState('');
    const [prize, setPrize] = useState('');
    const [teamSize, setTeamSize] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Web Development');
    const [priority, setPriority] = useState('Medium');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const payload = {
                name,
                registrationDeadline: regDate,
                location: location || 'Online',
                prize: prize || 'TBD',
                teamSize: teamSize || 'Any',
                description: description || '',
                category: category || 'Web Development',
                priority: priority || 'Medium',
                notificationsEnabled: notificationsEnabled
            };

            if (includePpt && pptDate) {
                payload.pptDeadline = pptDate;
            } else {
                payload.pptDeadline = new Date(new Date(regDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
            }

            await API.post('/hackathons', payload);
            setSuccessMessage('Hackathon added successfully! Redirecting...');
            setTimeout(() => navigate('/'), 1500);
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || 'Failed to add hackathon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6">
            <div className="mb-8">
                <Link to="/" className="text-indigo-600 hover:text-indigo-700 flex items-center mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-bold text-gray-900">Add New Hackathon</h1>
                <p className="text-gray-600 mt-2">Create a reminder for an upcoming hackathon event</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>{error}</div>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>{successMessage}</div>
                </div>
            )}

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                    {/* Basic Information */}
                    <div className="px-6 py-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hackathon Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="e.g. HackMIT 2026, DevCon Hackathon"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="e.g. San Francisco, CA"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prize Pool</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="e.g. $10,000"
                                        value={prize}
                                        onChange={e => setPrize(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Add any additional details about the hackathon..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deadlines */}
                    <div className="px-6 py-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Deadlines</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={regDate}
                                    onChange={e => setRegDate(e.target.value)}
                                />
                                <p className="mt-2 text-xs text-gray-500">Date & time when registration closes</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="includePpt"
                                        checked={includePpt}
                                        onChange={e => setIncludePpt(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="includePpt" className="ml-3 text-sm font-medium text-gray-900">
                                        Include PPT/Submission Deadline
                                    </label>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">Uncheck if this hackathon only requires registration</p>
                            </div>

                            {includePpt && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PPT/Submission Deadline</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        value={pptDate}
                                        onChange={e => setPptDate(e.target.value)}
                                    />
                                    <p className="mt-2 text-xs text-gray-500">Date & time for final project submission</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="px-6 py-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Details</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                    >
                                        <option>Web Development</option>
                                        <option>Mobile Development</option>
                                        <option>Machine Learning</option>
                                        <option>AI/LLM</option>
                                        <option>DevOps</option>
                                        <option>Blockchain</option>
                                        <option>IoT</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        value={priority}
                                        onChange={e => setPriority(e.target.value)}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="e.g. 1-5 members"
                                    value={teamSize}
                                    onChange={e => setTeamSize(e.target.value)}
                                />
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="notifications"
                                        checked={notificationsEnabled}
                                        onChange={e => setNotificationsEnabled(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="notifications" className="ml-3 text-sm font-medium text-gray-900">
                                        Enable Email Reminders
                                    </label>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">You'll receive reminders 3 days and 1 day before each deadline</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-8 bg-gray-50 flex justify-end space-x-4">
                        <Link
                            to="/"
                            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition"
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
