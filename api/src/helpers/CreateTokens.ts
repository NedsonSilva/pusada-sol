import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import User from '../models/User';

export const createAccessToken = (user: User): string => {
    const { secret, expiresIn } = authConfig;

    return sign(
        {
            id: user.id,
            usarname: user.name,
            profile: user.profile,
        },
        secret,
        {
            expiresIn
        }
    );
};

export const createRefreshToken = (user: User): string => {
    const { refreshSecret, refreshExpiresIn } = authConfig;

    return sign(
        { id: user.id, tokenVersion: user.tokenVersion },
        refreshSecret,
        {
            expiresIn: refreshExpiresIn
        }
    );
};
