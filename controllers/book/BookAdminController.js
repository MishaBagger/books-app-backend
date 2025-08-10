const BookAdminService = require('../../services/book/bookAdminService.js')
const ApiError = require('../../exceptions/ApiError.js')
const slugGenerator = require('../../utils/slugGenerator.js')
const dateGenerator = require('../../utils/dateGenerator.js')

class bookAdminController {
    async addBook(req, res, next) {
        try {
            const { title, description, date, link, platform } = req.body

            if (!req.file) {
                throw ApiError.BadRequest(
                    'Файл фотографии не загружен или формат не поддерживается!'
                )
            }

            const slug = slugGenerator(title)
            const isoDate = dateGenerator(date)

            const image = req.file.filename

            const bookData = await BookAdminService.addBook(
                slug,
                title,
                description,
                isoDate,
                image,
                link,
                platform
            )

            if (!bookData || !bookData.success) {
                throw ApiError.InternalServerError(
                    'Ошибка при добавлении книги!'
                )
            }

            return res.status(201).json({
                ...bookData,
                title: 'Книга успешно добавлена!',
                description: `Книга "${bookData.dataValues.title}" успешно добавлена.`,
            })
        } catch (e) {
            next(e)
        }
    }

    async updateBook(req, res, next) {
        try {
            const { id } = req.params

             if (!id) {
                throw ApiError.BadRequest('Не выбрана книга для изменения!')
            }

            const { title, description, date, link, platform } = req.body

            const image = req?.file?.filename

            if (!title && !description && !date && !link && !platform && !image) {
                throw ApiError.BadRequest('Поля для изменений отсутствуют!')
            }

            let slug = false

            if (title) {
                slug = slugGenerator(title)
            }

            let isoDate = false

            if (date) {
                isoDate = dateGenerator(date)
            }

            const bookData = await BookAdminService.updateBook(
                id,
                slug,
                title,
                description,
                isoDate,
                image,
                link,
                platform
            )

            if (!bookData || !bookData.success) {
                throw ApiError.InternalServerError(
                    'Ошибка при изменении книги!'
                )
            }

            return res.status(201).json({
                ...bookData,
                title: 'Книга успешно изменена!',
                description: `Книга "${bookData.dataValues.title}" успешно изменена.`,
            })
        } catch (e) {
            next(e)
        }
    }

    async deleteBook(req, res, next) {
        try {
             const { id } = req.params

             if (!id) {
                throw ApiError.BadRequest('Не выбрана книга для удаления!')
            }

            const bookData = await BookAdminService.deleteBook(id)

            if (!bookData || !bookData.success) {
                throw ApiError.InternalServerError(
                    'Ошибка при удалении книги!'
                )
            }

            return res.status(200).json({
                ...bookData,
                title: 'Книга успешно удалена!',
                description: bookData.message,
            })
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new bookAdminController()
