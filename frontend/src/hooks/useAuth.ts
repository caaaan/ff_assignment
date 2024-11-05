import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {jwtDecode} from 'jwt-decode'; // Ensure you have this package installed
import { getTokenFromCookie } from '@/lib/utils';

/*
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = getTokenFromCookie('token');
        
        if (!token) {
            console.error('no token present: ', token)
            router.push('/login'); // Redirect to login if not authenticated
            return;
        }

        // Decode the token to check its expiration
        try {
            const decodedToken: any = jwtDecode(token);
            console.error(decodedToken) //SIL
            const currentTime = Date.now() / 1000; // Current time in seconds

            // Check if the token is expired
            if (decodedToken.exp < currentTime) {
                console.error('time exceeded')
                document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
                router.push('/login') // Redirect to login
            } else {
                setIsAuthenticated(true); // Token is valid
                console.log('valid token')
                // Set a cookie with the token
                

            }
        } catch (error) {
            console.error('Token decoding failed:', error)
            document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;` // Remove invalid token from cookies
            router.push('/login') // Redirect to login
        }
    }, [router]);

    return isAuthenticated; // Return the authentication state
};
*/

const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        // Check if the token cookie exists
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        console.log('auth cookie: ', document.cookie)
        console.log('auth cookie split: ', document.cookie.split('; '))
        console.log('auth hook token: ', token)
        if (!token) {
            // If no token, redirect to login page
            router.push('/login');
        }
    }, [router]);
};



export default useAuth;
