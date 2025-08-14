const MetricModel = require('../models/metricModel.js')

module.exports = async function (req, res, next) {
    const COOKIE_PREFIX = 'kalinina_books_'

    try {
        if (req.method !== 'GET') return next()

        // if (req.path.startsWith('/click')) {
        //     const { button } = req.params
        //     const buttonMetric = METRIC_CONFIG.button[button]

        //     if (buttonMetric) {
        //         await MetricModel.increment(buttonMetric, {
        //             where: {
        //                 id: 1,
        //             },
        //         })
        //     }
        // }

        // Кука для домена (общая для всех страниц)
        if (!req.cookies[`${COOKIE_PREFIX}host`]) {
            await MetricModel.increment('value', {
                where: {
                    name: 'visits',
                    period: 'monthly',
                },
                by: 1,
            })
            res.cookie(`${COOKIE_PREFIX}host`, 'visits', {
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
