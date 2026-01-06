import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

const HackathonCard = ({ hackathon, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 truncate" title={hackathon.name}>
                    {hackathon.name}
                </h3>

                <div className="space-y-4">
                    <div className="bg-emerald-50 p-3 rounded-lg">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                            Registration
                        </span>
                        <p className="text-sm font-medium text-gray-800">
                            {new Date(hackathon.registrationDeadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                        <CountdownTimer targetDate={hackathon.registrationDeadline} />
                    </div>

                    <div className="bg-indigo-50 p-3 rounded-lg">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                            PPT Submission
                        </span>
                        <p className="text-sm font-medium text-gray-800">
                            {new Date(hackathon.pptDeadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                        <CountdownTimer targetDate={hackathon.pptDeadline} isPpt />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <Link
                        to={`/edit/${hackathon._id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold px-3 py-1 rounded hover:bg-indigo-50 transition"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => onDelete(hackathon._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 rounded hover:bg-red-50 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HackathonCard;
