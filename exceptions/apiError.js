module.exports = class ApiError extends Error {
    status
    errors

    constructor (status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static BadRequest (message, errors = []) {
        return new ApiError (400, message, errors)
    }

    static BadCaptchaToken () {
        return new ApiError(400, 'Токен капчи не обнаружен!')
    }

    static BadVerifiedCaptchaToken() {
        return new ApiError(400, 'Токен капчи не прошёл верификацию!')
    }

    static UnAuthorizedError () {
        return new ApiError (401, 'Пользователь не авторизован')
    }

    static NonAdminError () {
        return new ApiError (403, 'Пользователь не администратор')
    }

    static NotFound (message) {
        return new ApiError (404, message)
    }

    static InternalServerError (message) {
        return new ApiError(500, message)
    }
}