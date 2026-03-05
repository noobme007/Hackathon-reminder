import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initial state sync (Synchronous check for URL and localStorage)
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        const urlId = params.get('id');

        if (urlToken && urlId) {
            const userData = {
                _id: urlId,
                name: params.get('name'),
                email: params.get('email'),
                token: urlToken
            };
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        }

        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            // 1. Double-check for URL tokens (Aggressive Sync)
            const params = new URLSearchParams(window.location.search);
            const urlToken = params.get('token');
            const urlId = params.get('id');

            if (urlToken && urlId && !user) {
                const userData = {
                    _id: urlId,
                    name: params.get('name'),
                    email: params.get('email'),
                    token: urlToken
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                window.history.replaceState({}, document.title, window.location.pathname);
                setLoading(false);
                return;
            }

            // 2. Clear URL if we already have the user
            if (params.get('token')) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            // 3. Sync with backend if needed
            if (!user) {
                try {
                    const { data } = await API.get('/auth/me');
                    const userData = { ...data, token: data.token || user?.token };
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                } catch (error) {
                    // Not logged in
                }
            }

            // Small delay to prevent layout thrashing on mobile
            setTimeout(() => setLoading(false), 300);
        };
        verifyUser();
    }, [user]);

    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const { data } = await API.post('/auth/signup', { name, email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {loading ? (
                <div className="min-h-screen bg-slate-50 flex justify-center items-center">
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Verifying Session...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
