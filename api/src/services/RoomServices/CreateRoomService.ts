import * as Yup from 'yup';
import { Room } from '../../models/Room';
import AppError from '../../errors/AppError';

interface Request {
    type: string;
    number: string;
    capacity: number;
    dailyPrice: string;
    description: string
    status?: string;
}

export const CreateRoomService = async ({
    number,
    capacity,
    dailyPrice,
    description,
    status
}: Request): Promise<Room> => {
    const schema = Yup.object().shape({
        number: Yup.string()
            .required()
            .test(
                'check-unique-number',
                'Já existe um quarto com esse número',
                async value => {
                    if (!value) return false;
                    const exists = await Room.count({
                        where: { number: value }
                    });
                    return !exists;
                }
            ),
        capacity: Yup.string().required('capacity é obrigatório'),
        dailyPrice: Yup.number().required('dailyPrice é obrigatório'),
    })

    try {
        await schema.validate({
            number,
            capacity,
            dailyPrice,
            description,
            status,
        });
    } catch (err) {
        throw new AppError(err.message);
    }


    const room = await Room.create({
        type: '',
        number,
        capacity,
        dailyPrice,
        description,
        status
    });

    return room
}
