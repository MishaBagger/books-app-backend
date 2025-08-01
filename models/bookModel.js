const { DataTypes } = require('sequelize')
const sequelize = require('../controllers/database.js')

const Book = sequelize.define(
    'Book',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.CHAR,
            allowNull: false,
        },
        description: {
            type: DataTypes.CHAR,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        image: {
            type: DataTypes.CHAR,
            allowNull: false,
        },
        link: {
            type: DataTypes.CHAR,
            allowNull: false,
        },
        platform: {
            type: DataTypes.CHAR,
            allowNull: false,
            defaultValue: 'Литрес',
        },
    },
    {
        tableName: 'books',
        timestamps: false,
    }
)

module.exports = Book
