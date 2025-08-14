const BookService = require('../../services/book/bookService.js')
const ApiError = require('../../exceptions/ApiError.js')

class BookController {
    async getBooks(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 8

            const result = await BookService.getBooks(page, limit)

            if (!result.books.length) {
                throw ApiError.NotFound('Книги не найдены!')
            }

            return res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }
}
module.exports = new BookController()
