const ApiError = require('../exceptions/apiError.js')
const logger = require('../logging/logger.js')
module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        logger.error({
            timestamp: new Date().toLocaleString('ru-RU'),
            status: err.status,
            message: err.message,
            request: {
                url: req.originalUrl,
                path: req.path,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                user: req?.user?.id,
            },
            errors: err.errors,
        })

        return res
            .status(err.status)
            .json({ message: err.message, errors: err.errors })
    }
    logger.error({
        timestamp: new Date().toLocaleString('ru-RU'),
        error: err,
        request: {
            url: req.originalUrl,
            path: req.path,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            user: req?.user?.id,
        },
    })

    return res
        .status(500)
        .json({ message: err.message || 'Непредвиденная ошибка' })
}