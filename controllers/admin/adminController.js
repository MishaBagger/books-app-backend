const AdminService = require('../../services/admin/adminService.js')
const ApiError = require('../../exceptions/apiError.js')

class AdminController {
    async getMetrics(req, res, next) {
        try {
            const metrics = await AdminService.getMetrics()

            if(!metrics) {
                throw ApiError.NotFound('Метрики не найдены!')
            }

            return res.status(200).json(metrics)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new AdminController()