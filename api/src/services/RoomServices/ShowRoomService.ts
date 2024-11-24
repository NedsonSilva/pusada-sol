import AppError from '../../errors/AppError';
import { Room } from '../../models/Room';

export const ShowRoomService = async (id: number) => {
    const room = await Room.findOne({
        where: { id },
    });

    if (!room) {
        throw new AppError('Quarto não encontrado', 404);
    }

    return room;
};
