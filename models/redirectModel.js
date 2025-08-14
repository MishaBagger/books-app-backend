const { DataTypes } = require('sequelize')
const sequelize = require('../controllers/database.js')
const Book = require('./bookModel.js')

const Redirect = sequelize.define(
    'Redirect',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Book,
                key: 'id',
            },
        },
        value: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: 'redirects',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    }
)

Redirect.belongsTo(Book, {
    foreignKey: 'bookId',
    targetKey: 'id',
    allowNull: false,
})

module.exports = Redirect
