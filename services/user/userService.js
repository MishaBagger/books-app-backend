const OrderModel = require('../../models/order-model.js')

class UserService {

    async getUserOrders(userId) {
        try {
            const orders = await OrderModel.findAll({
                where: { userId },
                order: [
                    ['createdAt', 'DESC'],
                ],
            })
            return orders
        } catch (error) {
            throw error
        }
    }

}

module.exports = new UserService()