import AppError from '../../errors/AppError';
import { ShowRoomService } from './ShowRoomService';

export const DeleteRoomService = async (id: string | number): Promise<void> => {
    const room = await ShowRoomService(+id);

    if (!room) {
        throw new AppError('Quarto não encontrado', 404);
    }

    await room.destroy({ force: true });
};
