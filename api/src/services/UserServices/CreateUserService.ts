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

export const CreateUserService = async ({
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
                'Já existe um usuário cadastro com esse e-mail',
                async value => {
                    if (!value) return false;
                    const emailExists = await User.count({
                        where: { email: value }
                    });
                    return !emailExists;
                }
            ),
        password: Yup.string().required('password é obrigatório').min(5),
        profile: Yup.number().required('profile é obrigatório'),
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
