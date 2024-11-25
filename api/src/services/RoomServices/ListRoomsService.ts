import { col, fn, Op, where, WhereOptions } from 'sequelize';

import { ResponseBase } from '../../@types/response-base';
import { Room } from '../../models/Room';

interface Request {
    searchParam?: string;
    pageNumber?: string | number;
    perPage?: string | number;
}

export const ListRoomsService = async ({
    searchParam = '',
    pageNumber = 1,
    perPage = 20
}: Request): Promise<ResponseBase<Room>> => {
    let whereOptions: WhereOptions<Room> = {}

    if (searchParam) {
        const sanitazedSearchParam = searchParam
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .toLowerCase();

        whereOptions = {
            [Op.or]: [
                {
                    number: sanitazedSearchParam
                },
                {
                    type: {
                        [Op.like]: `%${sanitazedSearchParam}%`
                    }
                },
                {
                    description: {
                        [Op.like]: `%${sanitazedSearchParam}%`
                    }
                },
                {
                    description: {
                        [Op.like]: `%${sanitazedSearchParam}%`
                    }
                },
                {
                    dailyPrice: {
                        [Op.like]: `%${sanitazedSearchParam}%`
                    }
                },
                {
                    status: where(
                        fn('LOWER', col('Room.status')),
                        'LIKE',
                        `%${sanitazedSearchParam}%`
                    ) as any,
                }
            ],
        };
    }

    const limit = +perPage || 20;
    const offset = limit * (+pageNumber - 1);

    const { count, rows: rooms } = await Room.findAndCountAll({
        limit,
        offset,
        where: whereOptions,
        distinct: true,
        subQuery: false
    });

    const hasMore = count > offset + rooms.length;

    return {
        data: rooms,
        count,
        hasMore,
        page: +pageNumber,
        perPage: limit
    }
};
