const Router = require('express').Router
const router = Router()

const AdminController = require('../controllers/admin/AdminController.js')
const adminMiddleware = require('../middlewares/adminMiddleware.js')

const BookAdminController = require('../controllers/book/BookAdminController.js')
const bookMulterMiddleware = require('../middlewares/bookMulterMiddleware.js')

// Общая логика администратора

// Заявки
// router.get('/data/requests', adminMiddleware, RequestController.getAllRequests)
// router.get('/requests', adminMiddleware, RequestController.getRequests)
// router.get('/download/request/:id', adminMiddleware, RequestController.downloadRequest)
// router.delete('/request/:id', adminMiddleware, RequestController.deleteRequest)


// Книги
// router.get('/book', adminMiddleware, BookController.getBooks)
router.post('/book', adminMiddleware, bookMulterMiddleware.single('image'), BookAdminController.addBook)
router.patch('/book/:id', adminMiddleware, bookMulterMiddleware.single('image'), BookAdminController.updateBook)
router.delete('/book/:id', adminMiddleware, BookAdminController.deleteBook)

module.exports = router