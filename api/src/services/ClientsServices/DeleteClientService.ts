import AppError from "../../errors/AppError";
import { Client } from "../../models/Client";

export const DeleteClientService = async (id: number) => {
    const client = await Client.findOne({
        where: { id },
        attributes: ['id']
    });

    if (!client) {
        throw new AppError('Cliente nao encontrado', 404)
    }

    await client.destroy()
}
