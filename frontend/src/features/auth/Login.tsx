import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            const response = await api.post('/auth/login', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const { access_token } = response.data;

            // Set token header for next request
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            localStorage.setItem('token', access_token); // Temporarily set to allow interceptor to work if needed

            // Fetch user profile
            const userRes = await api.get('/users/me');
            login(access_token, userRes.data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">{error}</div>}

                <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-secondary/50 border border-border rounded-lg pl-10 p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-secondary/50 border border-border rounded-lg pl-10 p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary text-primary-foreground font-semibold p-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    Sign In
                </button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default Login;
