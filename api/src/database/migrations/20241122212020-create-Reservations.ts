import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
    async up (queryInterface: QueryInterface) {
        await queryInterface.createTable('Reservations', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            clientId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Clients', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            roomId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Rooms', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            checkinDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            checkoutDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            status: {
                type: DataTypes.STRING(30),
                allowNull: false,
                defaultValue: 'pendente'
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            discount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },
            notes: {
                type: DataTypes.STRING,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            }
        });

        await queryInterface.addIndex('Reservations', ['checkinDate'])
        await queryInterface.addIndex('Reservations', ['checkoutDate'])
        await queryInterface.addIndex('Reservations', ['status'])
        await queryInterface.addIndex('Reservations', ['totalPrice'])
        await queryInterface.addIndex('Reservations', ['discount'])
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('Reservations');
    }
};
