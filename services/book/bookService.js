const BookModel = require('../../models/bookModel.js')

class BookService {
    async getBooks() {
        try {
            const books = await BookModel.findAll()
            return books
        } catch (error) {
            throw error
        }
    }

    
}
module.exports = new BookService()
