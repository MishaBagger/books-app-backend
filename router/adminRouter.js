const Router = require('express').Router
const router = Router()

const AdminController = require('../controllers/admin/adminController.js')
const adminMiddleware = require('../middlewares/adminMiddleware.js')

const BookController = require('../controllers/admin/bookController.js')

const booksMulterMiddleware = require('../middlewares/booksMulterMiddleware.js')

// Общая логика администратора

// Заявки
// router.get('/data/requests', adminMiddleware, RequestController.getAllRequests)
// router.get('/requests', adminMiddleware, RequestController.getRequests)
// router.get('/download/request/:id', adminMiddleware, RequestController.downloadRequest)
// router.delete('/request/:id', adminMiddleware, RequestController.deleteRequest)


// Книги
router.get('/article', adminMiddleware, BookController.getArticle)
router.post('/article', adminMiddleware, booksMulterMiddleware.single('booksImage'), BookController.addArticle)
router.patch('/article/:id', adminMiddleware, BookController.updateArticle)
router.delete('/article/:id', adminMiddleware, BookController.deleteArticle)

module.exports = router