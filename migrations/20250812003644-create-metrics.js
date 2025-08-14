'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('metrics', 'name', {
            type: Sequelize.STRING(100),
            allowNull: false,
        })
        await queryInterface.addColumn('metrics', 'value', {
            type: Sequelize.BIGINT,
            allowNull: false,
        })
        await queryInterface.addColumn('metrics', 'period', {
            type: Sequelize.STRING(20),
            allowNull: true,
        })

        await queryInterface.addColumn('metrics', 'created_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        })

        await queryInterface.addColumn('metrics', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        })

        await queryInterface.addIndex('metrics', ['name', 'period'], {
            name: 'metrics_name_period_index',
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('metrics', 'metrics_name_period_index')
        await queryInterface.removeColumn('metrics', 'name')
        await queryInterface.removeColumn('metrics', 'value')
        await queryInterface.removeColumn('metrics', 'period')
        await queryInterface.removeColumn('metrics', 'created_at')
        await queryInterface.removeColumn('metrics', 'updated_at')
    },
}
