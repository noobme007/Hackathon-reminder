import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditHackathon = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [regDate, setRegDate] = useState('');
    const [pptDate, setPptDate] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Helper to format date for datetime-local input (YYYY-MM-DDThh:mm)
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().slice(0, 16);
    };

    useEffect(() => {
        const fetchHackathon = async () => {
            try {
                const { data } = await API.get('/hackathons'); // Optimization: create a retrieve-one endpoint
                // Since we didn't make a get-one endpoint in controller explicitly (oops, I only made getAll in previous step? Wait, let me check controller code I wrote)
                // Checked controller: 'router.route('/:id').put(updateHackathon).delete(deleteHackathon);' NO GET /:id!
                // I should update the controller to include getById or just filter from getAll here.
                // Efficient way: Implement getById in backend.
                // Temporary way: Fetch all and filter.

                const hackathon = data.find(h => h._id === id);
                if (hackathon) {
                    setName(hackathon.name);
                    setRegDate(formatDateForInput(hackathon.registrationDeadline));
                    setPptDate(formatDateForInput(hackathon.pptDeadline));
                } else {
                    setError('Hackathon not found');
                }
            } catch (e) {
                setError('Failed to fetch hackathon details');
            } finally {
                setLoading(false);
            }
        };
        fetchHackathon();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await API.put(`/hackathons/${id}`, {
                name,
                registrationDeadline: regDate,
                pptDeadline: pptDate
            });
            navigate('/');
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || 'Failed to update hackathon');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="md:flex md:items-center md:justify-between mb-6">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Edit Hackathon
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
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Link
                            to="/"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary"
                        >
                            {saving ? 'Saving...' : 'Update Hackathon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditHackathon;
