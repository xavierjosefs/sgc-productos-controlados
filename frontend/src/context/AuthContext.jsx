import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configurar axios para enviar el token en cada petición
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            // Asegurarse de que el header esté configurado
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.get(`${apiUrl}/api/auth/me`);

            if (response.data.ok) {
                setUser(response.data.user);
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        // Opcional: hacer fetchUser para asegurar datos frescos y rol
        fetchUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        loading,
        login,
        logout,
        fetchUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
