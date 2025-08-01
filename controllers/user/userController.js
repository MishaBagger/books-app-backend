const UserService = require('../../services/user/userService.js')
const ApiError = require('../../exceptions/apiError.js')
const recaptchaVerify = require('../../utils/recaptchaVerify.js')

class UserController {
    async getBooks(req, res, next) {
        try {
            const books = await UserService.getBooks()

            if (!books) {
                throw ApiError.NotFound('Ошибка при получении книги из Базы Данных!')
            }

            return res.status(200).json(books)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new UserController()