import AppError from '../../errors/AppError';
import User from '../../models/User';

const ShowUserService = async (id: number): Promise<User> => {
    const user = await User.findOne({
        where: {
            id,
        },
        attributes: [
            'id',
            'name',
            'email',
            'profile',
            'tokenVersion',
        ],
        order: [['name', 'asc']]
    });

    if (!user) {
        throw new AppError('Usuário não encontrado', 404);
    }

    return user;
};

export default ShowUserService;
