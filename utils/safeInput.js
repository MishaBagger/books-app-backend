const xss = require('xss')

const strictXss = new xss.FilterXSS({
    whiteList: {}, // Пустой белый список - ничего не разрешено
    stripIgnoreTag: true, // Полностью удаляем запрещённые теги
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object'], // Удаляем опасные элементы
})

function safeInput(data, type) {
    if (!data) return null

    const sanitize = (value) => {
        if (value == null) return null // Обрабатываем null/undefined
        return strictXss.process(String(value)).trim() // Приводим к строке и тримим
    }

    const protect = 'XSS protect'

    switch (type) {
        case 'request':
            return {
                ...data,
                username: sanitize(data.username) || protect,
                dateOfBirth: sanitize(data.dateOfBirth) || protect,
                address: sanitize(data.address) || protect,
                passportNumber: sanitize(data.passportNumber) || protect,
                passportIssued: sanitize(data.passportIssued) || protect,
                passportDate: sanitize(data.passportDate) || protect,
                snils: sanitize(data.snils) || protect,
                driversLicenseNumber: sanitize(data.driversLicenseNumber),
                driversLicenseDate: sanitize(data.driversLicenseDate),
                tractorsLicenseNumber: sanitize(data.tractorsLicenseNumber),
                tractorsLicenseDate: sanitize(data.tractorsLicenseDate),
                phone: sanitize(data.phone) || protect,
                requestDescription: data.requestDescription
                    ? sanitize(data.requestDescription) || protect
                    : null,

                // Обработка массивов
                tractorCategories: data.tractorCategories?.map(
                    (category) => sanitize(category) || protect
                ),
                professions: data.professions?.map((profession) =>
                    sanitize(profession) || protect
                ),
            }

        case 'order':
            return {
                username: sanitize(data.username) || protect,
                phone: sanitize(data.phone) || protect,
                email: sanitize(data.email),
                description: sanitize(data.description),
            }

        default:
            throw Error('Не указан тип валидатора!')
    }
}

module.exports = safeInput