import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
