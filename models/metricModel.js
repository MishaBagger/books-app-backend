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
        visits: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        redirects: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        users: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    },
    {
        tableName: 'metrics',
        timestamps: false,
    }
)

Metric.updateUserCount = async function() {
  const userCount = await sequelize.models.User.count()
  const metric = await this.findOne() || await this.create({})
  return await metric.update({ users: userCount })
}

Metric.updateUserCount()

setInterval(() => {
    Metric.updateUserCount()
}, 60 * 60 * 1000 )

module.exports = Metric
