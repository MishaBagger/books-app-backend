const BookService = require('../../services/book/bookService.js')
const ApiError = require('../../exceptions/ApiError.js')
const redisClient = require('./redisClient')

class BookController {
    async getBooks(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            const cacheKey = `books:page_${page}_limit_${limit}`

            const cachedData = await redisClient.get(cacheKey)
            
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }

            const result = await BookService.getBooks(page, limit)

            if (!result.books.length) {
                throw ApiError.NotFound('Книги не найдены!')
            }

            await redisClient.setEx(cacheKey, 3600, JSON.stringify(result))

            return res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new BookController()
