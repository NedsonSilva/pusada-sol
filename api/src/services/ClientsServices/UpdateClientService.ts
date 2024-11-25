import { Op } from 'sequelize';
import * as Yup from 'yup';

import AppError from '../../errors/AppError';
import { Client } from '../../models/Client';
import { ShowClientService } from './ShowClientService';

interface Request {
    id: number;
    name: string;
    phone: string;
    email: string;
    cpfCnpj: string;
    birthDate: string;
    addressZipCode: string;
    addressCity: string;
    addressState: string;
    addressNeighborhood: string;
    addressStreet: string;
    addressNumber: string;
    addressComplement: string;
}

export const UpdateClientService = async (data: Request) => {
    const {
        id,
        name,
        phone,
        email,
        cpfCnpj,
        birthDate,
    } = data;


    if (!id) {
        throw new AppError('id é obrigatório');
    }

    const schema = Yup.object().shape({
        email: Yup.string()
            .email('email inválido')
            .test(
                'check-unique-email',
                'Já existe um cliente com esse e-mail',
                async (value) => {
                    if (!value) return false;
                    const exists = await Client.count({
                        where: { email: value, id: { [Op.ne]: id } },
                    });
                    return !exists;
                }
            ),
        cpfCnpj: Yup.string()
            .test(
                'check-unique-cpf-cnpj',
                'Já existe um cliente com esse CPF ou CNPJ',
                async (value) => {
                    if (!value) return false;
                    const exists = await Client.count({
                        where: {
                            cpfCnpj: value,
                            id: { [Op.ne]: id }
                        },
                    });
                    return !exists;
                }
            ),
    });

    try {
        await schema.validate({
            name,
            phone,
            email,
            cpfCnpj,
            birthDate,
        });
    } catch (err) {
        throw new AppError(err.message);
    }

    const client = await ShowClientService(id);

    await client.update({
        ...data as any
    })

    return client;
};
