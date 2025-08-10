const UserModel = require('../models/userModel.js')
const { UserDto, UserDataDto } = require('../dtos/userDto.js')
const ApiError = require('../exceptions/ApiError.js')
const tokenService = require('../services/auth/tokenService.js')

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(ApiError.UnAuthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]

        if (!accessToken) {
            return next(ApiError.UnAuthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)

        if (!userData) {
            return next(ApiError.UnAuthorizedError())
        }

        const user = await UserModel.findByPk(userData.id)

        if (!user) {
            return next(ApiError.NotFound('Пользователь не найден в Базе Данных!'))
        }

        req.user = {
            ...new UserDto(user),
            ...new UserDataDto(user)
        };
        next()
    }
    catch (e) {
        return next(ApiError.UnAuthorizedError())
    }
}