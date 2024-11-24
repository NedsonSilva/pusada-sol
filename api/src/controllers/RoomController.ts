import { Request, Response } from 'express';

import AppError from '../errors/AppError';
import { ListRoomsService } from '../services/RoomServices/ListRoomsService';
import { DeleteUserService } from '../services/UserServices/DeleteUserService';
import ShowUserService from '../services/UserServices/ShowUserService';
import UpdateUserService from '../services/UserServices/UpdateUserService';
import { CreateRoomService } from './../services/RoomServices/CreateRoomService';
import { ShowRoomService } from '../services/RoomServices/ShowRoomService';
import { UpdateRoomService } from '../services/RoomServices/UpdateRoomService';
import { DeleteRoomService } from '../services/RoomServices/DeleteRoomService';

type IndexQuery = {
    searchParam: string;
    pageNumber: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
    const { searchParam, pageNumber } = req.query as IndexQuery;

    const response = await ListRoomsService({
        searchParam,
        pageNumber,
    });

    return res.json(response);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
    const room = await CreateRoomService(req.body);

    return res.status(200).json(room);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
    const { roomId } = req.params;

    const room = await ShowRoomService(+roomId);

    return res.status(200).json(room);
};

export const update = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { roomId } = req.params;
    const roomData = req.body;

    const user = await UpdateRoomService({
        id: + roomId,
        ...roomData
    });

    return res.status(200).json(user);
};

export const remove = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { roomId } = req.params;

    if (req.user.profile !== 99) {
        throw new AppError('Acesso negado', 403);
    }

    await DeleteRoomService(roomId);

    return res.status(200).json({ message: 'Quarto excluído' });
};
