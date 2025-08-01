const UserModel = require('../../models/userModel.js')
const { UserDto, UserDataDto } = require('../../dtos/userDto.js')
const tokenService = require('./tokenService.js')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')

class AuthService {
    async registration(login, password, username, email, phone) {
        try {
            const loginCandidate = await UserModel.findOne({
                where: { login },
            })

            if (loginCandidate) {
                throw new Error(
                    `Пользователь с таким логином ${login} уже существует!`
                )
            }

            const phoneCandidate = await UserModel.findOne({
                where: { phone },
            })

            if (phoneCandidate) {
                throw new Error(
                    `Пользователь с таким телефоном ${phone} уже существует!`
                )
            }
            if (email == '') {
                email = 'Не указана'
            }
            const userUUID = uuid.v4()
            const hashPassword = await bcrypt.hash(password, 3)
            const user = await UserModel.create({
                login,
                password: hashPassword,
                username,
                email,
                phone,
                uuid: userUUID,
            })

            const userDto = new UserDto(user)
            const userDataDto = new UserDataDto(user)
            const tokens = tokenService.generateTokens({ ...userDto })
            await tokenService.saveToken(userDto.id, tokens.refreshToken)

            return { ...tokens, user: { ...userDto, ...userDataDto } }
        } catch (error) {
            throw new Error(
                `Не удалось зарегистрировать аккаунт: ${error.message}`
            )
        }
    }

    async login(login, password) {
        try {
            const user = await UserModel.findOne({
                where: { login },
            })
            if (!user) {
                throw new Error(
                    `Пользователь с таким логином ${login} не найден!`
                )
            }

            const isPassEquals = await bcrypt.compare(password, user.password)
            if (!isPassEquals) {
                throw new Error(`Неверный пароль`)
            }
            const userDto = new UserDto(user)
            const userDataDto = new UserDataDto(user)
            const tokens = tokenService.generateTokens({ ...userDto })

            await tokenService.saveToken(userDto.id, tokens.refreshToken)

            return { ...tokens, user: { ...userDto, ...userDataDto } }
        } catch (error) {
            throw new Error(`Не удалось зайти в аккаунт: ${error.message}`)
        }
    }

    async logout(refreshToken) {
        try {
            const token = await tokenService.removeToken(refreshToken)
            return token
        } catch (error) {
            throw new Error(`Не удалось выйти из аккаунта: ${error.message}`)
        }
    }

    async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                throw new Error('Не авторизован!')
            }
            const userData = await tokenService.validateRefreshToken(
                refreshToken
            )
            const tokenFromDB = await tokenService.findToken(refreshToken)

            if (!userData || !tokenFromDB) {
                throw new Error('Валидация токена не прошла проверку с базой данных!')
            }

            const user = await UserModel.findByPk(userData.id)
            const userDto = new UserDto(user)
            const userDataDto = new UserDataDto(user)
            const tokens = tokenService.generateTokens({ ...userDto })

            await tokenService.saveToken(userDto.id, tokens.refreshToken)

            return { ...tokens, user: { ...userDto, ...userDataDto } }
        } catch (error) {
            throw new Error(
                `Не удалось обновить токен обновления: ${error.message}`
            )
        }
    }
}
module.exports = new AuthService()