import { Op } from 'sequelize';
import * as Yup from 'yup';

import AppError from '../../errors/AppError';
import { Room } from '../../models/Room';
import { ShowRoomService } from './ShowRoomService';

interface Request {
    id: number
    number?: string;
    capacity?: number;
    dailyPrice?: string;
    description?: string
    status?: string;
}

export const UpdateRoomService = async (data: Request): Promise<Room> => {
    const {
        id,
        number,
        capacity,
        dailyPrice,
        description,
        status
    } = data;

    const schema = Yup.object().shape({
        id: Yup.number().required('id é obrigatório'),
        number: Yup.string()
            .test(
                'check-unique-number',
                'Já existe um quarto com esse número',
                async value => {
                    if (!value) return false;
                    const exists = await Room.count({
                        where: {
                            number: value,
                            id: {[Op.ne]: id }
                        }
                    });
                    return !exists;
                }
            ),
    })

    try {
        await schema.validate({
            id,
            number,
            capacity,
            dailyPrice,
            description,
            status,
        });
    } catch (err) {
        throw new AppError(err.message);
    }

    const room = await ShowRoomService(id);

    await room.update({ ...data });

    return room
}
