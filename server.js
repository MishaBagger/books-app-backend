const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sequelize = require('./controllers/db-connect.js')
const router = require('./router/router.js')
const helmet = require('helmet')
const { globalLimiter, apiLimiter } = require('./utils/rateLimiters.js')

const errorMiddleware = require('./middlewares/error-middleware.js')
const PORT = process.env.PORT || 5000

const User = require('./models/user-model.js') // Файл модели User
const Token = require('./models/token-model.js') // Файл модели Token
const Order = require('./models/order-model.js') // Файл модели Order
const Service = require('./models/service-model.js') // Файл модели Service
const Article = require('./models/article-model.js') // Файл модели Article
const Vacancy = require('./models/vacancy-model.js') // Файл модели Vacancy
const Course = require('./models/course-model.js') // Файл модели Course
const Gallery = require('./models/gallery-model.js') // Файл модели Gallery
const Request = require('./models/request-model.js') // Файл модели Request
const Metric = require('./models/metric-model.js') // Файл модели Metric
const Banner = require('./models/banner-model.js') // Файл модели Banner
const Video = require('./models/video-model.js') // Файл модели Video

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
                model: Order,
                message:
                    'Таблица заказов пользователей успешно синхронизирована',
            },
            {
                model: Service,
                message: 'Таблица слайдера услуг успешно синхронизирована',
            },
            {
                model: Article,
                message: 'Таблица статей успешно синхронизирована',
            },
            {
                model: Vacancy,
                message: 'Таблица вакансий успешно синхронизирована',
            },
            {
                model: Course,
                message: 'Таблица курсов успешно синхронизирована',
            },
            {
                model: Gallery,
                message: 'Таблица галереи успешно синхронизирована',
            },
            {
                model: Request,
                message: 'Таблица заявок успешно синхронизирована',
            },
            {
                model: Metric,
                message: 'Таблица метрик успешно синхронизирована',
            },
            {
                model: Banner,
                message: 'Таблица баннеров успешно синхронизирована',
            },
            {
                model: Video,
                message: 'Таблица видео успешно синхронизирована',
            },
        ]

        for (const table of tables) {
            const syncResult = await table.model.sync() // Создание таблицы, если она не существует
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
    res.sendFile(
        '',
        {
            maxAge: '1d',
            dotfiles: 'deny',
        },
        (err) => {
            if (err) {
                console.error(`Ошибка отправки файла: ${err}`)
                res.status(404).send('Файл не найден')
            }
        }
    )
})

start()
