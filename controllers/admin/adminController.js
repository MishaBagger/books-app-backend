const AdminService = require('../../services/admin/adminService.js')
const ApiError = require('../../exceptions/ApiError.js')

class AdminController {
    async getMetrics(req, res, next) {
        try {
            const metrics = await AdminService.getMetrics()

            if (!metrics) {
                throw ApiError.NotFound('Метрики не найдены!')
            }

            return res.status(200).json(metrics)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await AdminService.getUsers()

            if (!users) {
                throw ApiError.InternalServerError(
                    'Ошибка при получении пользователей!'
                )
            }
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AdminController()
