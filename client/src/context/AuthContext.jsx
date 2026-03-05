import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            // 1. Check if we just redirected from Google (token in URL)
            const params = new URLSearchParams(window.location.search);
            const urlToken = params.get('token');
            const urlId = params.get('id');
            const urlName = params.get('name');
            const urlEmail = params.get('email');

            if (urlToken && urlId) {
                const userData = {
                    _id: urlId,
                    name: urlName,
                    email: urlEmail,
                    token: urlToken
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
                return;
            }

            // 2. Fallback to existing localStorage check
            const savedUser = JSON.parse(localStorage.getItem('user'));
            if (savedUser) {
                setUser(savedUser);
            } else {
                try {
                    const { data } = await API.get('/auth/me');
                    localStorage.setItem('user', JSON.stringify(data));
                    setUser(data);
                } catch (error) {
                    // Not logged in, that's fine
                }
            }
        };
        checkUser();
    }, []);

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
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
