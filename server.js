const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sequelize = require('./controllers/database.js')
const router = require('./router/router.js')
const helmet = require('helmet')
const { globalLimiter, apiLimiter } = require('./utils/rateLimiters.js')

const errorMiddleware = require('./middlewares/errorMiddleware.js')
const PORT = process.env.PORT || 5000

const User = require('./models/userModel.js')
const Token = require('./models/tokenModel.js')
const Book = require('./models/bookModel.js')

const app = express()

const start = async () => {
    try {
        sequelize
            .authenticate()
            .then(() => {
                console.log('Подключение к базе данных MySQL успешно')
            })
            .catch((err) => {
                console.log(
                    `Подключение к базе данных MySQL провалилось: ${err}`
                )
            })

        const tables = [
            {
                model: User,
                message: 'Таблица пользователей успешно синхронизирована',
            },
            {
                model: Token,
                message:
                    'Таблица токенов пользователей успешно синхронизирована',
            },
                        {
                model: Book,
                message:
                    'Таблица книг успешно синхронизирована',
            },
        ]

        for (const table of tables) {
            const syncResult = await table.model.sync()
            if (syncResult) {
                console.log(table.message)
            }
        }

        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

// Заголовки
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "'unsafe-eval'",
                    'https://vk.com',
                    'https://yandex.ru',
                    'https://*.yandex.ru',
                    'https://*.google.com',
                    'https://*.gstatic.com',
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://fonts.googleapis.com',
                    'https://maxcdn.bootstrapcdn.com',
                ],
                fontSrc: [
                    "'self'",
                    'data:',
                    'https://fonts.gstatic.com',
                    'https://maxcdn.bootstrapcdn.com',
                ],
                frameSrc: [
                    "'self'",
                    'https://yandex.ru',
                    'https://*.yandex.ru',
                    'https://*.google.com',
                ],
                imgSrc: ["'self'", 'https://vk.com', 'data:'],
                connectSrc: ["'self'", 'https://*.google.com'],
            },
        },
        xFrameOptions: false,
        xContentTypeOptions: false,
        xXssProtection: false,
        referrerPolicy: false,
        strictTransportSecurity: false,
    })
)

// Обработка CORS
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL,
    })
)

// Парсинг Cookies и JSON
app.use(cookieParser())
app.use(express.json())

// Rate Limiter
app.use(globalLimiter)

// Роутер API
app.use('/api', apiLimiter, router)

// Обработка ошибок
app.use(errorMiddleware)

// Статика из public
app.use(express.static('public'))

// Обработка HTML
app.get('*', (req, res) => {
    res.json('Backend is working!')
})

start()
