const express = require('express')
const router = express.Router()
const authRouter = require('./authRouter')
const adminRouter = require('./adminRouter')
const { adminLimiter, authLimiter, orderLimiter, requestLimiter } = require('../utils/rateLimiters.js')

const UserController = require('../controllers/user/userController.js')
const authMiddleware = require('../middlewares/auth-middleware.js')
const metricMiddleware = require('../middlewares/metric-middleware.js')

router.get('/', metricMiddleware)
router.get('/click/:button', metricMiddleware)

// Логика обычного пользователя
router.get('/services', UserController.getServices)
router.get('/articles', metricMiddleware, UserController.getArticles)
router.get('/vacancies', metricMiddleware, UserController.getVacancies)
router.get('/gallery', UserController.getGallery)
router.get('/banners', UserController.getBanners)
router.get('/videos', UserController.getVideos)
router.get('/note/:slug', UserController.getNote)
router.get('/job/:slug', UserController.getJob)

router.post('/order', orderLimiter, UserController.order)
router.post('/request', requestLimiter, UserController.request)

router.get('/user/courses', authMiddleware, UserController.getUserCourses)
router.get('/user/orders', authMiddleware, UserController.getUserOrders)

// Подключаем под-роутеры
router.use('/auth', authLimiter, authRouter)
router.use('/admin', adminLimiter, adminRouter)

module.exports = router