const BookService = require('../../services/book/bookService.js')
const ApiError = require('../../exceptions/ApiError.js')

class BookController {
    async getBooks(req, res, next) {
        try {
            const books = await BookService.getBooks()

            if(!books) {
                throw ApiError.NotFound('Книги не найдены!')
            }

            return res.status(200).json(books)
        } catch (e) {
            next(e)
        }
    }

    
}
module.exports = new BookController()