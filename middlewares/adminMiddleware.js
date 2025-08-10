const ApiError = require('../exceptions/ApiError.js')
const tokenService = require('../services/auth/tokenService.js')
const AdminService = require('../services/admin/adminService.js')

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

        const admin = await AdminService.getAdmin(userData.id)

        if (!admin) {
            return next(ApiError.NonAdminError())
        }

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnAuthorizedError())
    }
}