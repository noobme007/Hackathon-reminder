import { Link } from 'react-router-dom';
import { useState } from 'react';
import API from '../services/api';
import CountdownTimer from './CountdownTimer';

const HackathonCard = ({ hackathon, onDelete }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'High':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Low':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Web Development':
                return 'bg-blue-50 text-blue-700';
            case 'Mobile Development':
                return 'bg-green-50 text-green-700';
            case 'Machine Learning':
                return 'bg-purple-50 text-purple-700';
            case 'AI/LLM':
                return 'bg-pink-50 text-pink-700';
            case 'DevOps':
                return 'bg-indigo-50 text-indigo-700';
            case 'Blockchain':
                return 'bg-yellow-50 text-yellow-700';
            case 'IoT':
                return 'bg-teal-50 text-teal-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 flex-1 pr-2 line-clamp-2" title={hackathon.name}>
                        {hackathon.name}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getPriorityColor(hackathon.priority)}`}>
                        {hackathon.priority || 'Medium'}
                    </div>
                </div>
                {hackathon.category && (
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(hackathon.category)}`}>
                        {hackathon.category}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-6 py-4 flex-1">
                {/* Details Grid */}
                {(hackathon.location || hackathon.prize || hackathon.teamSize) && (
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
                        {hackathon.location && (
                            <div className="text-xs">
                                <p className="text-gray-500 font-medium">Location</p>
                                <p className="text-gray-900 font-semibold">{hackathon.location}</p>
                            </div>
                        )}
                        {hackathon.prize && (
                            <div className="text-xs">
                                <p className="text-gray-500 font-medium">Prize</p>
                                <p className="text-gray-900 font-semibold">{hackathon.prize}</p>
                            </div>
                        )}
                        {hackathon.teamSize && (
                            <div className="text-xs col-span-2">
                                <p className="text-gray-500 font-medium">Team Size</p>
                                <p className="text-gray-900 font-semibold">{hackathon.teamSize}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Description */}
                {hackathon.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {hackathon.description}
                    </p>
                )}

                {/* Deadlines */}
                <div className="space-y-3">
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                            Registration Deadline
                        </span>
                        <p className="text-sm font-medium text-gray-800">
                            {new Date(hackathon.registrationDeadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                        <CountdownTimer targetDate={hackathon.registrationDeadline} />
                    </div>

                    {hackathon.pptDeadline && (
                        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                                Submission Deadline
                            </span>
                            <p className="text-sm font-medium text-gray-800">
                                {new Date(hackathon.pptDeadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                            <CountdownTimer targetDate={hackathon.pptDeadline} isPpt />
                        </div>
                    )}
                </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3 mt-auto">
                <div className="flex flex-wrap items-center gap-2">
                    {hackathon.googleEventLink && (
                        <a
                            href={hackathon.googleEventLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[140px] inline-flex items-center justify-center px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all group"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Calendar Event
                            <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    )}
                </div>

                <div className="flex justify-end items-center gap-2 pt-2 border-t border-gray-200/50">
                    <Link
                        to={`/edit/${hackathon._id}`}
                        className="inline-flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </Link>
                    <button
                        onClick={() => onDelete(hackathon._id)}
                        className="inline-flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HackathonCard;
