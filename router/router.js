const express = require('express')
const router = express.Router()
const authRouter = require('./authRouter')
const adminRouter = require('./adminRouter')
const { adminLimiter, authLimiter } = require('../utils/rateLimiters.js')

const UserController = require('../controllers/user/userController.js')
const authMiddleware = require('../middlewares/authMiddleware.js')
const metricMiddleware = require('../middlewares/metricMiddleware.js')

router.get('/', metricMiddleware)
router.get('/click/:button', metricMiddleware)

// Логика обычного пользователя
router.get('/books', UserController.getBooks)

// Подключаем под-роутеры
router.use('/auth', authLimiter, authRouter)
router.use('/admin', adminLimiter, adminRouter)

module.exports = router