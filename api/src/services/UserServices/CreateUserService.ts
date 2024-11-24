import * as Yup from 'yup';

import AppError from '../../errors/AppError';
import { SerializeUser } from '../../helpers/SerializeUser';
import User from '../../models/User';

interface Request {
    email: string;
    password: string;
    name: string;
    profile?: number;
}

interface Response {
    id: number;
    name: string;
    email: string;
    profile: number;
}

const CreateUserService = async ({
    email,
    password,
    name,
    profile = 10,
}: Request): Promise<Response> => {
    const schema = Yup.object().shape({
        name: Yup.string().required().min(2),
        email: Yup.string()
            .email()
            .required()
            .test(
                'Check-email',
                'An user with this email already exists.',
                async value => {
                    if (!value) return false;
                    const emailExists = await User.findOne({
                        where: { email: value }
                    });
                    return !emailExists;
                }
            ),
        password: Yup.string().required().min(5)
    });

    try {
        await schema.validate({ email, password, name });
    } catch (err) {
        throw new AppError(err.message);
    }

    const user = await User.create(
        {
            email,
            password,
            name,
            profile,
        },
    );

    await user.reload();

    return SerializeUser(user);
};

export default CreateUserService;
