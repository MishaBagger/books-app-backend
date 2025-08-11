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
        platform: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ЛитРес',
        },
    },
    {
        tableName: 'books',
        timestamps: false,
        hooks: {
            beforeCreate: (book) => {
                if (!book.platform) {
                    book.platform = 'ЛитРес'
                }
            },
        },
    }
)

module.exports = Book
