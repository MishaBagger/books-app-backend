const { rateLimit } = require('express-rate-limit')

// Глобальный лимитер (HTML + Scripts)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    limit: 500,
    standardHeaders: 'draft-8',
    legacyHeaders: true,
    message: {message: 'Слишком много запросов с вашего IP, попробуйте позже.'},
})

// Лимитер для API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    limit: 200, // Макс. 200 запросов
    message: {message: 'Слишком много запросов к API с вашего IP, попробуйте позже.'},
})

// Лимитер для аутентификации
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    limit: 50, // Макс. 50 запросов
    message: {message: 'Слишком много попыток авторизации с вашего IP, попробуйте позже.'},
})

// Лимитер для админа
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    limit: 200, // Макс. 200 запросов
    message: {message: 'Слишком много админ запросов с вашего IP, попробуйте позже.'},
})

// Лимитер для заявок
const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    limit: 5, // Макс. 5 запросов
    message: {message: 'Слишком много заказов с вашего IP, попробуйте позже.'},
})

// Лимитер для заявлений
const requestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    limit: 5, // Макс. 5 запросов
    message: {message: 'Слишком много заявлений с вашего IP, попробуйте позже.'},
})

module.exports = {
    globalLimiter,
    apiLimiter,
    authLimiter,
    adminLimiter,
    orderLimiter,
    requestLimiter,
}
