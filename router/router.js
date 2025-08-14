const express = require('express')
const router = express.Router()
const authRouter = require('./authRouter')
const adminRouter = require('./adminRouter')
const { adminLimiter, authLimiter } = require('../utils/rateLimiters.js')

// const UserController = require('../controllers/user/userController.js')
const authMiddleware = require('../middlewares/authMiddleware.js')
const metricMiddleware = require('../middlewares/metricMiddleware.js')
const BookController = require('../controllers/book/BookController.js')

// Логика системы метрик
router.get('/', metricMiddleware)
router.get('/redirect/:bookId', metricMiddleware)

// Логика обычного неавторизованного пользователя
router.get('/books', BookController.getBooks)

// Подключаем под-роутеры
router.use('/auth', authLimiter, authRouter)
router.use('/admin', adminLimiter, adminRouter)

module.exports = router