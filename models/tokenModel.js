const { DataTypes } = require('sequelize');
const sequelize = require('../controllers/database.js');
const User = require('./userModel.js');

const Token = sequelize.define('Token', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'tokens',
    timestamps: false
});

Token.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
    allowNull: false
});

module.exports = Token;