import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
    async up (queryInterface: QueryInterface) {
        await queryInterface.createTable('Users', {
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
            profile: {
                type: DataTypes.SMALLINT,
                allowNull: false,
            },
            status: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                defaultValue: 0
            },
            lastLogin: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            passwordHash: {
                type: DataTypes.STRING,
                allowNull: false
            },
            tokenVersion: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                defaultValue: 0
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

        await queryInterface.addIndex('Users', ['name'])
        await queryInterface.addIndex('Users', ['email'])
        await queryInterface.addIndex('Users', ['profile'])
        await queryInterface.addIndex('Users', ['status'])
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('Users');
    }
};
