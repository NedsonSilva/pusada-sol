import AppError from "../../errors/AppError"
import { Client } from "../../models/Client"
import { Reservation } from "../../models/Reservation"

export const ShowClientService = async (id: number): Promise<Client> => {
    const client = await Client.findOne({
        where: { id },
        include: [
            {
                model: Reservation,
                as: 'reservations'
            }
        ]
    });

    if (!client) {
        throw new AppError('Cliente nao encontrado', 404)
    }

    return client;
}
