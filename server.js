const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sequelize = require('./controllers/database.js')
const router = require('./router/router.js')
const helmet = require('helmet')
const compression = require('compression')
const { globalLimiter, apiLimiter } = require('./utils/rateLimiters.js')

const errorMiddleware = require('./middlewares/errorMiddleware.js')
const PORT = process.env.PORT || 5000

const User = require('./models/userModel.js')
const Token = require('./models/tokenModel.js')
const Book = require('./models/bookModel.js')
const Metric = require('./models/metricModel.js')

const app = express()

const start = async () => {
    try {
        sequelize
            .authenticate()
            .then(() => {
                console.log('Подключение к базе данных \x1b[33m MySQL\x1b[0m \x1b[32m успешно \x1b[0m')
            })
            .catch((err) => {
                console.log(
                    `Подключение к базе данных \x1b[33m MySQL\x1b[0m \x1b[31m провалилось: ${err} \x1b[0m`
                )
            })

        const tables = [
            {
                model: User,
                message: 'Таблица \x1b[33m пользователей\x1b[0m успешно \x1b[32m синхронизирована \x1b[0m',
            },
            {
                model: Token,
                message:
                    'Таблица \x1b[33m токенов пользователей\x1b[0m успешно \x1b[32m синхронизирована \x1b[0m',
            },
            {
                model: Book,
                message: 'Таблица \x1b[33m книг\x1b[0m успешно \x1b[32m синхронизирована \x1b[0m',
            },
            { model: Metric,
                message: 'Таблица \x1b[33m метрик\x1b[0m успешно \x1b[32m синхронизирована \x1b[0m'
            }
        ]

        for (const table of tables) {
            const syncResult = await table.model.sync()
            if (syncResult) {
                console.log(table.message)
            }
        }

        app.listen(PORT, () => console.log(`Бэкенд \x1b[33m сервер\x1b[0m запущен на порту \x1b[32m ${PORT} \x1b[0m`))
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
                frameAncestors: [
                    "'self'",
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

// Компрессия
app.use(compression({
  level: 6,
  threshold: '1kb',
  filter: (req) => !req.headers['x-no-compression']
}));

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
