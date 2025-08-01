const UserService = require('../../services/user/userService.js')
const ApiError = require('../../exceptions/api-error.js')
const recaptchaVerify = require('../../utils/recaptchaVerify.js')

class UserController {
    async getUserOrders(req, res, next) {
        try {
            const orders = await UserService.getUserOrders(req.user.id)

            if (!orders) {
                throw ApiError.NotFound('Заявки пользователя не найдены!')
            }

            return res.status(200).json(orders)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new UserController()