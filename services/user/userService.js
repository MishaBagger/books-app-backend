const BookModel = require('../../models/bookModel.js')

class UserService {

    async getBooks() {
        try {
            const books = await BookModel.findAll({
                order: [
                    ['date', 'DESC'],
                ],
            })
            return books
        } catch (error) {
            throw error
        }
    }

}

module.exports = new UserService()