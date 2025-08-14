const MetricModel = require('../models/metricModel.js')
const RedirectModel = require('../models/redirectModel.js')

module.exports = async function (req, res, next) {
    const COOKIE_PREFIX = 'kalinina_books_'

    try {
        if (req.method !== 'GET') return next()

        if (req.path.startsWith('/redirect')) {
            const { bookId } = req.params

            await MetricModel.increment('value', {
                where: {
                    name: 'redirects',
                    period: 'monthly',
                },
                by: 1,
            })

            const [redirect, created] = await RedirectModel.findOrCreate({
                where: {
                    bookId,
                },
                defaults: {
                    value: 1,
                },
            })

            if (!created) {
                await redirect.increment('value', { by: 1 });
            }
        }

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
        next({message: 'Ошибка счётчика метрик'})
    }
}
