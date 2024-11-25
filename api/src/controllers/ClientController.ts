import { Request, Response } from 'express';

import AppError from '../errors/AppError';
import { ListClientsService } from '../services/ClientsServices/ListClientsService';
import { CreateClientService } from '../services/ClientsServices/CreateClientService';
import { ShowClientService } from '../services/ClientsServices/ShowClientService';
import { UpdateClientService } from '../services/ClientsServices/UpdateClientService';
import { DeleteClientService } from '../services/ClientsServices/DeleteClientService';

type IndexQuery = {
    searchParam: string;
    pageNumber: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
    const { searchParam, pageNumber } = req.query as IndexQuery;

    const response = await ListClientsService({
        searchParam,
        pageNumber,
    });

    return res.json(response);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
    const room = await CreateClientService(req.body);

    return res.status(200).json(room);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
    const { clientId } = req.params;

    const room = await ShowClientService(+clientId);

    return res.status(200).json(room);
};

export const update = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { clientId } = req.params;
    const clientData = req.body;

    const user = await UpdateClientService({
        id: + clientId,
        ...clientData
    });

    return res.status(200).json(user);
};

export const remove = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { clientId } = req.params;

    if (req.user.profile !== 99) {
        throw new AppError('Acesso negado', 403);
    }

    await DeleteClientService(+clientId);

    return res.status(200).json({ message: 'Cliente excluído' });
};
