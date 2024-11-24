import * as Yup from 'yup';

import AppError from '../../errors/AppError';
import { SerializeUser } from '../../helpers/SerializeUser';
import ShowUserService from './ShowUserService';
import User from '../../models/User';

interface UserData {
    email?: string;
    password?: string;
    name?: string;
    profile?: number;
}

interface Request {
    userData: UserData;
    userId: number;
}

type Response = Pick<User, 'id' | 'name' | 'email' | 'profile'>;

const UpdateUserService = async ({
    userData,
    userId,
}: Request): Promise<Response | undefined> => {
    const user = await ShowUserService(+userId);

    const schema = Yup.object().shape({
        name: Yup.string().min(5),
        email: Yup.string().email(),
        profile: Yup.number(),
        password: Yup.string()
    });

    const {
        email,
        password,
        profile,
        name,
    } = userData;

    try {
        await schema.validate({ email, password, profile, name });
    } catch (err) {
        throw new AppError(err.message);
    }

    await user.update({
        email,
        password,
        profile,
        name,
    });

    await user.reload();

    return SerializeUser(user);
};

export default UpdateUserService;
