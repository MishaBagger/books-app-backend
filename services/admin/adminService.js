const UserModel = require('../../models/userModel.js')
const MetricModel = require('../../models/metricModel.js')

class AdminService {
    async getMetrics() {
        try {
            const metrics = await MetricModel.findOne()

            return metrics
        } catch (error) {
            throw error
        }
    }

    async getUsers() {
        try {
            const users = await UserModel.findAll()
            return users
        } catch (error) {
            throw error
        }
    }

    async getAdmin(id) {
        try {
            const admin = await UserModel.findOne({
                where: {
                    id,
                    role: 'admin',
                },
            })

            if (!admin) {
                return null
            }
            return admin
        } catch (error) {
            throw error
        }
    }
}

module.exports = new AdminService()