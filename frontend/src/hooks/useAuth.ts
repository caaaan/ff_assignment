import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login'); // Redirect to login if not authenticated
        } else {
            setIsAuthenticated(true);
        }
    }, []);

    return isAuthenticated; // Optionally, you can return this if needed
};

export default useAuth;
