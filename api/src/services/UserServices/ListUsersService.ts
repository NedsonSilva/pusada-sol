import { Op, Sequelize, WhereOptions } from 'sequelize';

import { ResponseBase } from '../../@types/response-base';
import User from '../../models/User';

interface Request {
    searchParam?: string;
    pageNumber?: string | number;
    perPage?: string | number;
}

interface Response extends ResponseBase<User> {}

const ListUsersService = async ({
    searchParam = '',
    pageNumber = '1',
    perPage = '20',
}: Request): Promise<Response> => {
    let whereCondition: WhereOptions<User> = {};

    if (searchParam) {
        const sanitazedSearchParam = searchParam
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .toLowerCase();
        whereCondition = {
            [Op.or]: [
                {
                    '$User.name$': Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('User.name')),
                        'LIKE',
                        `%${sanitazedSearchParam}%`
                    ),
                },
                { email: { [Op.like]: `%${sanitazedSearchParam}%` } },
            ],
        };
    }

    const limit = +perPage || 20;
    const offset = limit * (+pageNumber - 1);

    const { count, rows: users } = await User.findAndCountAll({
        where: whereCondition,
        attributes: [
            'name',
            'id',
            'email',
            'profile',
            'status',
            'lastLogin',
            'createdAt',
            'updatedAt',
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    const hasMore = count > offset + users.length;

    return {
        data: users,
        count,
        hasMore,
        page: +pageNumber,
        perPage: limit,
    };
};

export default ListUsersService;
