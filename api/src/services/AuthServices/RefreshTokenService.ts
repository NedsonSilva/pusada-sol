import { Response as Res } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../../config/auth';
import AppError from '../../errors/AppError';
import { createAccessToken, createRefreshToken } from '../../helpers/CreateTokens';
import User from '../../models/User';
import ShowUserService from '../UserServices/ShowUserService';

interface RefreshTokenPayload {
    id: number;
    tokenVersion: number;
}

interface Response {
    user: User;
    newToken: string;
    refreshToken: string;
}

export const RefreshTokenService = async (
    res: Res,
    token: string
): Promise<Response> => {
    try {
        const decoded = verify(token, authConfig.refreshSecret);
        const { id, tokenVersion } = decoded as RefreshTokenPayload;

        const user = await ShowUserService(id);

        if (user.tokenVersion !== tokenVersion) {
            res.clearCookie('jrt');
            throw new AppError('ERR_SESSION_EXPIRED', 401);
        }

        const newToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        return { user, newToken, refreshToken };
    } catch (err) {
        res.clearCookie('jrt');
        throw new AppError('ERR_SESSION_EXPIRED', 401);
    }
};
