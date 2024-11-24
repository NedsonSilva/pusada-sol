import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
    async up (queryInterface: QueryInterface) {
        await queryInterface.createTable('Rooms', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            type: {
                type: DataTypes.STRING(60),
                allowNull: false
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            dailyPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            number: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.STRING(30),
                allowNull: false,
                defaultValue: 'available'
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

        await queryInterface.addIndex('Rooms', ['type'])
        await queryInterface.addIndex('Rooms', ['capacity'])
        await queryInterface.addIndex('Rooms', ['dailyPrice'])
        await queryInterface.addIndex('Rooms', ['number'])
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('Rooms');
    }
};
