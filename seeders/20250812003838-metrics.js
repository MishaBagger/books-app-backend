'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('metrics', [
      {
        metric_name: 'total_visits',
        metric_value: 0,
        period_type: 'all_time',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        metric_name: 'monthly_visits',
        metric_value: 0,
        period_type: 'monthly',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        metric_name: 'store_redirects',
        metric_value: 0,
        period_type: 'all_time',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        metric_name: 'registered_users',
        metric_value: 0,
        period_type: 'all_time',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('metrics', null, {});
  }
};