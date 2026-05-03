import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return null;
        }

        try {
            const res = await getCurrentUser();
            const userData = res.data.user;
            
            // Normalize name if needed
            if (userData && userData.username && !userData.name) {
                userData.name = userData.username;
            }
            
            setUser(userData);
            return userData;
        } catch (error) {
            console.error("Auth check failed:", error);
            // If it's a 401, the interceptor in api.js will handle clearing token
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};