import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface TokenPayload {
    id: string;
    username: string;
    profile: number;
    iat: number;
    exp: number;
}

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('invalid authorization', 401);
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        throw new AppError('invalid token', 401);
    }

    try {
        const decoded = verify(token, authConfig.secret);
        const { id, profile } = decoded as TokenPayload;

        req.user = {
            id,
            profile,
        };
    } catch (err) {
        throw new AppError(
            "Invalid token. We'll try to assign a new one on next request",
            403
        );
    }

    return next();
};

export default isAuth;
