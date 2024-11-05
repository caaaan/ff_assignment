import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '..';
import { User } from '../entities/userEntity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
export class AuthController {
    
    public async register(req: Request, res: Response): Promise<Response> {
        const { username, password } = req.body;

        // Validate that username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

    try {
        // Check if user already exists
        const existingUser = await AppDataSource.getRepository(User).findOneBy({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user with hashed password
        const user = new User();
        user.username = username;
        user.password = hashedPassword;
        await AppDataSource.getRepository(User).save(user);

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

    public async login(req: Request, res: Response): Promise<Response> {
        const { username, password } = req.body;
        console.log('Login attempt for username:', username, 'with password:', password);

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Find user in the database
        const user = await AppDataSource.getRepository(User).findOneBy({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        } else if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid password' });
            //return res.status(400).json({ error: 'Invalid credentials' }); FORMAT TO THIS
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access
            maxAge: 3600000, // Cookie expiry in milliseconds (1 hour)
            path: '/' // Path for the cookie
        });
    
        // Send token to client
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Middleware to protect routes
public authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token; // Retrieve the token from cookies
    console.log('Token received:', token); // Add this line
    if (!token) {
        console.log('No token, unauthorized'); // Add this line
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            console.log('Token verification failed:', err); // Add this line
            return res.sendStatus(403); // Forbidden
        }
        (req as any).user = user; // Attach user info to request
        return next();
    });
}

}

export const authController = new AuthController();