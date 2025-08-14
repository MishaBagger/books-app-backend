const UserModel = require('../../models/userModel.js')
const MetricModel = require('../../models/metricModel.js')
const RedirectModel = require('../../models/redirectModel.js')
const BookModel = require('../../models/bookModel.js')

class AdminService {
    async getMetrics() {
        try {
            const metrics = await MetricModel.findAll()

            const redirects = await RedirectModel.findAll({
                include: [
                    {
                        model: BookModel,
                        attributes: ['title'],
                        required: true,
                    },
                ],
            })
            return { metrics, redirects }
        } catch (error) {
            throw error
        }
    }

    async getBooks() {
        try {
            const books = await BookModel.findAll({ order: ['id', 'title'] })
            return books
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
