import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
    async up (queryInterface: QueryInterface) {
        await queryInterface.createTable('Payments', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            reservationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Reservations', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            clientId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Clients', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            method: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'pendente'
            },
            paymentDate: {
                type: DataTypes.DATE,
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

        await queryInterface.addIndex('Payments', ['method'])
        await queryInterface.addIndex('Payments', ['price'])
        await queryInterface.addIndex('Payments', ['status'])
        await queryInterface.addIndex('Payments', ['paymentDate'])
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('Payments');
    }
};
