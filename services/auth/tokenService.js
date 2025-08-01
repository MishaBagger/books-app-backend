const jwt = require('jsonwebtoken')
const tokenModel = require('../../models/tokenModel.js')
const sequelize = require('../../controllers/database.js')
class TokenService {
    generateTokens (payload) { 
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '8h'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '3d'})
        return {
            accessToken,
            refreshToken
        }


    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        }
        catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        }
        catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({
            where: { userId }
        })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({userId, refreshToken})
        return token
    }

    async removeToken (refreshToken) {
        try {
            const [results] = await sequelize.query('DELETE FROM tokens WHERE refreshToken = ?', {
                replacements: [refreshToken]
            });
    
            return results;
        } catch (error) {
            throw new Error('Вы уже разлогинились! ', error.message);
        }
    }

    async findToken (refreshToken) {
        const tokenData = await tokenModel.findOne({
            where: {refreshToken}
        })
        return tokenData
    }
}

module.exports = new TokenService()