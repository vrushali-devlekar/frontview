import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // App start hote hi check karo token hai ya nahi
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Tere backend ka route jo current user lata hai (e.g., /auth/me ya token verify)
                    // Abhi ke liye hum bas token hone pe dummy user set kar rahe hain hackathon speed ke liye
                    setUser({ username: "SHERYIAN_DEV", token });
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUser();
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
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};