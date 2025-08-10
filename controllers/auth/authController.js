const { validationResult } = require('express-validator')
const ApiError = require('../../exceptions/ApiError.js')
const AuthService = require('../../services/auth/authService.js')
const recaptchaVerify = require('../../utils/recaptchaVerify.js')

class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                throw ApiError.BadRequest(
                    'Ошибка валидации при регистрации: ',
                    errors.array()
                )
            }

            const { login, password, username, email, phone, recaptcha } = req.body

            // if (!recaptcha) {
            //     throw ApiError.BadCaptchaToken();
            // }

            // const captchaVerify = await recaptchaVerify(recaptcha)

            // if (!captchaVerify) {
            //     throw ApiError.BadVerifiedCaptchaToken()
            // }

            const userData = await AuthService.registration(
                login,
                password,
                username,
                email,
                phone
            )

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
            })
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { login, password, recaptcha } = req.body

            // if (!recaptcha) {
            //     throw ApiError.BadCaptchaToken();
            // }

            // const captchaVerify = await recaptchaVerify(recaptcha)

            // if (!captchaVerify) {
            //     throw ApiError.BadVerifiedCaptchaToken()
            // }

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                throw ApiError.BadRequest(
                    'Ошибка валидации при авторизации: ',
                    errors.array()
                )
            }

            const userData = await AuthService.login(login, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 72 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
            })
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies

            if (!refreshToken) {
                throw ApiError.NotFound(
                    'Токен обновления не обнаружен или истёк!'
                )
            }

            const token = await AuthService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.status(200).json(token)
        } catch (e) {
            next(e)
        }
    }

    async access(req, res, next) {
        try {
            if (!req.user) {
                return next(
                    new ApiError(
                        401,
                        'Пользователь не аутентифицировался через токен доступа!'
                    )
                )
            }
            return res.status(200).json({ user: req.user })
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies

            if (!refreshToken) {
                throw ApiError.NotFound(
                    'Токен обновления не обнаружен или истёк!'
                )
            }
            
            const userData = await AuthService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 72 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
            })
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }
}
module.exports = new AuthController()