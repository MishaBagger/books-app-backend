const MetricModel = require('../models/metricModel.js')

module.exports = async function (req, res, next) {
    // Конфигурация метрик
    const METRIC_CONFIG = {
        path: {
            '/': 'visits',
            '/vacancies': 'vacancies',
            '/articles': 'articles',
        },
        host: {
            'xn--80aaaimngmjlngja3a4a9b8b.xn--p1ai': 'domainRU',
            'школамеханизаторов.рф': 'domainRU',
            'mechanizatory.ru': 'domainENG',
        },
        button: {
            asking: 'clickAsking',
            training: 'clickTraining',
        },
    }

    const COOKIE_PREFIX = 'kalinina_books_'

    try {
        if (req.method !== 'GET') return next()

        if (req.path.startsWith('/click')) {
            const { button } = req.params
            const buttonMetric = METRIC_CONFIG.button[button]

            if (buttonMetric) {
                await MetricModel.increment(buttonMetric, {
                    where: {
                        id: 1,
                    },
                })
            }
        }

        const pathMetric = METRIC_CONFIG.path[req.path]
        const hostMetric = METRIC_CONFIG.host[req.hostname]

        if (!pathMetric || !hostMetric) return next()

        // Кука для домена (общая для всех страниц)
        if (!req.cookies[`${COOKIE_PREFIX}host`]) {
            await MetricModel.increment(hostMetric, {
                where: {
                    id: 1,
                },
            })
            res.cookie(`${COOKIE_PREFIX}host`, hostMetric, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
            })
        }

        // Кука для конкретной страницы
        if (!req.cookies[`${COOKIE_PREFIX}page_${pathMetric}`]) {
            await MetricModel.increment(pathMetric, {
                where: {
                    id: 1,
                },
            })
            res.cookie(`${COOKIE_PREFIX}page_${pathMetric}`, pathMetric, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
            })
        }

        next()
    } catch (e) {
        console.error(`Ошибка счетчика метрик: ${e}`)
        next()
    }
}