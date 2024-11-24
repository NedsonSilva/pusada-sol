import { addDays } from 'date-fns';
import { QueryInterface } from 'sequelize';
import { v4 as uuid } from 'uuid'

module.exports = {
    async up(queryInterface: QueryInterface) {
        const transaction = await queryInterface.sequelize.transaction({ autocommit: false })

        try {
            await queryInterface.bulkInsert(
                'Users',
                [
                    {
                        id: 1,
                        name: 'Administrador',
                        email: 'admin@admin.com',
                        passwordHash: '$2y$08$g4p8OAM.y/KOjAkCV3TboOkXTxmYGlq6XlZknrKY4uMt2R5CM6dGi', // pass: admin.*123
                        profile: 99,
                        status: 1,
                    }
                ],
                { transaction }
            );
            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        }

    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.bulkDelete('Companies', {});
        await queryInterface.bulkDelete('Users', {});
    }
};
