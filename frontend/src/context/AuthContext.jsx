import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, updateCurrentUser } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState(() => localStorage.getItem('user_avatar') || 'pf5.jpeg');

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await getCurrentUser();
                    const currentUser = response.data?.user || null;
                    if (currentUser) {
                        setUser({ ...currentUser, token });
                        if (currentUser.avatar || currentUser.avatarUrl) {
                            const resolvedAvatar = currentUser.avatar || currentUser.avatarUrl;
                            setAvatar(resolvedAvatar);
                            localStorage.setItem('user_avatar', resolvedAvatar);
                        }
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser({ ...userData, token });
        if (userData?.avatar || userData?.avatarUrl) {
            const resolvedAvatar = userData.avatar || userData.avatarUrl;
            setAvatar(resolvedAvatar);
            localStorage.setItem('user_avatar', resolvedAvatar);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_avatar');
        setUser(null);
    };

    const updateAvatar = (newAvatar) => {
        setAvatar(newAvatar);
        localStorage.setItem('user_avatar', newAvatar);
        setUser((prev) => prev ? { ...prev, avatar: newAvatar, avatarUrl: newAvatar } : prev);

        updateCurrentUser({ avatarUrl: newAvatar }).catch(() => null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, avatar, updateAvatar }}>
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
