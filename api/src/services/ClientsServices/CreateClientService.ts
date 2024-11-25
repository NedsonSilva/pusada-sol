import * as Yup from 'yup';

import AppError from '../../errors/AppError';
import { Client } from '../../models/Client';

interface Request {
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

export const CreateClientService = async ({
    name,
    phone,
    email,
    cpfCnpj,
    birthDate,
    addressZipCode,
    addressCity,
    addressState,
    addressNeighborhood,
    addressStreet,
    addressNumber,
    addressComplement,
}: Request) => {
    const schema = Yup.object().shape({
        name: Yup.string().required('name é obrigatório'),
        phone: Yup.string().required('phone é obrigatório'),
        email: Yup.string()
            .required('email é obrigatório')
            .email('email inválido')
            .test(
                'check-unique-email',
                'Já existe um cliente com esse e-mail',
                async (value) => {
                    if (!value) return false;
                    const exists = await Client.count({
                        where: { email: value },
                    });
                    return !exists;
                }
            ),
        cpfCnpj: Yup.string()
            .required('CPF ou CNPJ é obrigatório')
            .test(
                'check-unique-cpf-cnpj',
                'Já existe um cliente com esse CPF ou CNPJ',
                async (value) => {
                    if (!value) return false;
                    const exists = await Client.count({
                        where: {
                            cpfCnpj: value,
                        },
                    });
                    return !exists;
                }
            ),
        birthDate: Yup.string().required('Data de nascimento é obrigatório'),
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

    const [client] = await Client.upsert({
        name,
        phone,
        email,
        cpfCnpj,
        birthDate: birthDate as any,
        addressZipCode,
        addressCity,
        addressState,
        addressNeighborhood,
        addressStreet,
        addressNumber,
        addressComplement,
        deletedAt: null
    });

    return client;
};
