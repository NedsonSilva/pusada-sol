import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

module.exports = {
    async up (queryInterface: QueryInterface) {
        await queryInterface.createTable('Clients', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: false
            },
            cpfCnpj: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: false
            },
            birthDate: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            gender: {
                type: DataTypes.STRING(40),
                allowNull: true
            },
            addressZipCode: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            addressCity: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            addressState: {
                type: DataTypes.STRING(2),
                allowNull: true,
            },
            addressNeighborhood: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            addressStreet: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            addressNumber: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            addressComplement: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            status: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                defaultValue: 1
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

        await queryInterface.addIndex('Clients', ['name'])
        await queryInterface.addIndex('Clients', ['phone'])
        await queryInterface.addIndex('Clients', ['email'])
        await queryInterface.addIndex('Clients', ['cpfCnpj'])
        await queryInterface.addIndex('Clients', ['birthDate'])
        await queryInterface.addIndex('Clients', ['addressState'])
        await queryInterface.addIndex('Clients', ['status'])
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('Clients');
    }
};
