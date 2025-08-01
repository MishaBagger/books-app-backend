const { DataTypes } = require('sequelize')
const sequelize = require('../controllers/database.js')

const Metric = sequelize.define(
    'Metric',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        domainRU: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        domainENG: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        visits: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        vacancies: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        articles: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        clickAsking: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        clickTraining: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: 'metrics',
        timestamps: false,
    }
)

module.exports = Metric