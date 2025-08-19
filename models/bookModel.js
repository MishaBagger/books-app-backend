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
        slug: {
            type: DataTypes.CHAR,
            allowNull: false,
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
    },
    {
        tableName: 'books',
        timestamps: false,
    }
)

module.exports = Book
