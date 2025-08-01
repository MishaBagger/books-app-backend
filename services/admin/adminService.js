const UserModel = require('../../models/user-model.js')
const MetricModel = require('../../models/metric-model.js')

class AdminService {
    async getMetrics() {
        try {
            const metrics = await MetricModel.findOne()

            if (!metrics) {
                await MetricModel.create({
                    visits: 0,
                    vacancies: 0,
                    articles: 0,
                    domainRU: 0,
                    domainENG: 0,
                    clickAsking: 0,
                    clickTraining: 0,
                })
            }

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