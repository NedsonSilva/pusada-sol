import AppError from '../../errors/AppError';
import User from '../../models/User';

export const DeleteUserService = async (id: string | number): Promise<void> => {
    const user = await User.findOne({
        where: { id },
        attributes: ['id', 'profile'],
    });

    if (!user) {
        throw new AppError('Usuário não encontrado', 404);
    }

    if (user.profile === 99) {
        const countUsersAdmin = await User.count({
            where: {
                profile: 99
            }
        });

        if (countUsersAdmin === 1) {
            throw new AppError('Não pode excluir o ultimo administrador');
        }
    }

    await user.destroy();
};
