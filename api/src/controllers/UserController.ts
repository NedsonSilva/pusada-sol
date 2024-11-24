import { Request, Response } from 'express';

import AppError from '../errors/AppError';
import CreateUserService from '../services/UserServices/CreateUserService';
import { DeleteUserService } from '../services/UserServices/DeleteUserService';
import ListUsersService from '../services/UserServices/ListUsersService';
import ShowUserService from '../services/UserServices/ShowUserService';
import UpdateUserService from '../services/UserServices/UpdateUserService';

type IndexQuery = {
    searchParam: string;
    pageNumber: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
    const { searchParam, pageNumber } = req.query as IndexQuery;

    const response = await ListUsersService({
        searchParam,
        pageNumber,
    });

    return res.json(response);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, name, profile, queueIds, connectionId } = req.body;

    if (req.url === '/signup') {
        throw new AppError('ERR_USER_CREATION_DISABLED', 403);
    } else if (req.url !== '/signup' && req.user.profile < 50) {
        throw new AppError('ERR_NO_PERMISSION', 403);
    }

    const user = await CreateUserService({
        email,
        password,
        name,
        profile,
    });

    return res.status(200).json(user);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;

    const user = await ShowUserService(+userId);

    return res.status(200).json(user);
};

export const update = async (
    req: Request,
    res: Response
): Promise<Response> => {
    if (req.user.profile < 50) {
        throw new AppError('ERR_NO_PERMISSION', 403);
    }

    const { userId } = req.params;
    const userData = req.body;

    const user = await UpdateUserService({
        userData,
        userId: +userId,
    });

    return res.status(200).json(user);
};

export const remove = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { userId } = req.params;

    if (req.user.profile !== 99) {
        throw new AppError('Acesso negado', 403);
    }

    await DeleteUserService(userId);

    return res.status(200).json({ message: 'Usuário excluído' });
};
