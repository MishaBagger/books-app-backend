const Router = require('express').Router
const router = Router()

const AdminController = require('../controllers/admin/adminController.js')
const adminMiddleware = require('../middlewares/adminMiddleware.js')

const BookController = require('../controllers/admin/bookController.js')

const bookMulterMiddleware = require('../middlewares/bookMulterMiddleware.js')

// Общая логика администратора

// Заявки
// router.get('/data/requests', adminMiddleware, RequestController.getAllRequests)
// router.get('/requests', adminMiddleware, RequestController.getRequests)
// router.get('/download/request/:id', adminMiddleware, RequestController.downloadRequest)
// router.delete('/request/:id', adminMiddleware, RequestController.deleteRequest)


// Книги
router.get('/book', adminMiddleware, BookController.getBook)
router.post('/book', adminMiddleware, bookMulterMiddleware.single('image'), BookController.addBook)
router.patch('/book/:id', adminMiddleware, BookController.updateBook)
router.delete('/book/:id', adminMiddleware, BookController.deleteBook)

module.exports = router