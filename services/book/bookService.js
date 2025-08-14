const BookModel = require('../../models/bookModel.js')

class BookService {
    async getBooks(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit
            const { count, rows: books } = await BookModel.findAndCountAll({
                offset,
                limit,
            })

            return {
                books,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
            }
        } catch (error) {
            throw error
        }
    }
}
module.exports = new BookService()
