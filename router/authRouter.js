const Router = require('express').Router
const router = Router()
const { body } = require('express-validator')
const AuthController = require('../controllers/auth/AuthController.js')
const authMiddleware = require('../middlewares/authMiddleware.js')

// Регистрация и авторизация
router.post('/register', body('login').notEmpty(), body('password').isLength({ min: 8, max: 40 }), AuthController.registration)
router.post('/login', body('login').notEmpty(), body('password').notEmpty(), AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/access', authMiddleware, AuthController.access)
router.get('/refresh', AuthController.refresh)

module.exports = router