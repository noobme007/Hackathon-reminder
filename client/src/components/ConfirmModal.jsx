import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel', type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 sm:pb-24">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
                onClick={onCancel}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Visual Decoration */}
                <div className={`absolute top-0 inset-x-0 h-2 ${type === 'danger' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-indigo-500 to-violet-600'}`} />

                <div className="p-8 pt-10">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className={`w-20 h-20 rounded-3xl ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'} flex items-center justify-center mb-6 shadow-sm border border-white`}>
                            {type === 'danger' ? (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            ) : (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all border border-slate-200/50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-6 py-4 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'} text-white font-bold rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>

                {/* Bottom Footer Info (Subtle) */}
                <div className="bg-slate-50/50 p-4 text-center border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center">
                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Security Protected Action
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
