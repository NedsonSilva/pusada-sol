import { col, fn, Op, where, WhereOptions } from 'sequelize';

import { ResponseBase } from '../../@types/response-base';
import { Client } from '../../models/Client';

interface Request {
    searchParam?: string;
    pageNumber?: string | number;
    perPage?: string | number;
}

export const ListClientsService = async ({
    searchParam = '',
    pageNumber = 1,
    perPage = 20
}: Request): Promise<ResponseBase<Client>> => {
    let whereOptions: WhereOptions<Client> = {}

    if (searchParam) {
        const sanitazedSearchParam = searchParam
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .toLowerCase();

        whereOptions = {
            [Op.or]: [
                {
                    cpfCnpj: {
                        [Op.like]: `%${sanitazedSearchParam}%`
                    }
                },
                {
                    name: where(
                        fn('LOWER', col('Client.name')),
                        'LIKE',
                        `%${sanitazedSearchParam}%`
                    ) as any,
                },
                {
                    phone: {
                        [Op.like]: `%${sanitazedSearchParam}%`
                    }
                },
                {
                    email: where(
                        fn('LOWER', col('Client.email')),
                        'LIKE',
                        `%${sanitazedSearchParam}%`
                    ) as any,
                },
            ],
        };
    }

    const limit = +perPage || 20;
    const offset = limit * (+pageNumber - 1);

    const { count, rows: rooms } = await Client.findAndCountAll({
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
