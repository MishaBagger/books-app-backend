'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('books', 'platform', {
      type: Sequelize.STRING, // Меняем CHAR на STRING
      allowNull: false,
      defaultValue: 'ЛитРес' // Добавляем дефолтное значение
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('books', 'platform', {
      type: Sequelize.CHAR, // Возвращаем обратно
      allowNull: false
      // Убираем defaultValue при откате
    });
  }
};