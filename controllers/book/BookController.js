const BookService = require('../../services/book/bookService.js')
const redisClient = require('../../caching/redisClient.js')

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

            await redisClient.setEx(cacheKey, 3600, JSON.stringify(result))

            return res.status(200).json(result)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new BookController()
