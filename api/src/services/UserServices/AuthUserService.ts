import AppError from '../../errors/AppError';
import { createAccessToken, createRefreshToken } from '../../helpers/CreateTokens';
import { SerializeUser } from '../../helpers/SerializeUser';
import User from '../../models/User';

interface SerializedUser {
    id: number;
    name: string;
    email: string;
    profile: number;
}

interface Request {
    email: string;
    password: string;
}

interface Response {
    serializedUser: SerializedUser;
    token: string;
    refreshToken: string;
}

const AuthUserService = async ({
    email,
    password
}: Request): Promise<Response> => {
    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        throw new AppError('E-mail ou senha incorretos', 401);
    }

    if (!(await user.checkPassword(password))) {
        throw new AppError('E-mail ou senha incorretos', 401);
    }

    const token = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const serializedUser = SerializeUser(user);

    await user.update({
        lastLogin: new Date()
    })

    return {
        serializedUser,
        token,
        refreshToken
    };
};

export default AuthUserService;
