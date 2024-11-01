import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '..';
import { User } from '../entities/userEntity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
    public async register(req: Request, res: Response): Promise<Response> {
        const { username, password } = req.body;

        // Validate that username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
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
        console.log('Login attempt for username:', username);

        const user = await AppDataSource.getRepository(User).findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        } else if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
        return res.json({ token });
    }

    public authenticateToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

        if (!token) return res.sendStatus(401); // Unauthorized

        jwt.verify(token, 'your_jwt_secret', (err, user) => {
            if (err) return res.sendStatus(403); // Forbidden
            (req as any).user = user; // Attach user info to request
            return next();
        });
    }
}

export const authController = new AuthController();