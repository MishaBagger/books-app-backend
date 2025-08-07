const BookService = require('../../services/admin/bookService.js')
const slugGenerator = require('../../utils/slugGenerator.js')
const ApiError = require('../../exceptions/apiError.js')

class BooksController {
    async getBook(req, res, next) {
        try {
            const articles = await BookService.getArticle()

            if(!articles) {
                throw ApiError.NotFound('Статьи не найдены!')
            }

            return res.status(200).json(articles)
        } catch (e) {
            next(e)
        }
    }

    async addBook(req, res, next) {
        try {
            const { articleTitle, articleDescription, articleText } = req.body

            const articleSlug = slugGenerator(articleTitle)

            if (!req.file) {
                throw ApiError.BadRequest(
                    'Файл фотографии не загружен или формат не поддерживается!'
                )
            }

            const image = req.file.filename
            const articleData = await BookService.addArticle(
                articleSlug,
                articleTitle,
                articleDescription,
                articleText,
                image
            )

            if (!articleData || !articleData.success) {
                throw ApiError.InternalServerError(
                    'Ошибка при добавлении статьи!'
                )
            }

            return res.status(201).json({
                ...articleData,
                title: 'Статья успешно добавлена!',
                description: `Статья "${articleData.dataValues.title}" успешно добавлена.`,
            })
        } catch (e) {
            next(e)
        }
    }

    async updateBook(req, res, next) {
        try {
            const { id } = req.params
            const { title, description, text } = req.body


            if (!id) {
                throw ApiError.BadRequest('Не выбрана статья для изменения!')
            }

            if (!title && !description && !text) {
                throw ApiError.BadRequest('Поля для изменений отсутствуют!')
            }

            const slug = slugGenerator(title)

            const articleData = await BookService.updateArticle(
                id,
                title,
                description,
                text,
                slug
            )

            if (!articleData || !articleData.success) {
                throw ApiError.InternalServerError(
                    'Ошибка при изменении статьи!'
                )
            }
            return res.status(201).json({
                ...articleData,
                title: 'Статья успешно изменена!',
                description: `Статья "${articleData.dataValues.title}" успешно изменена.`,
            })
        } catch (e) {
            next(e)
        }
    }

    async deleteBook(req, res, next) {
        try {
            const { id } = req.params

            if (!id) {
                throw ApiError.BadRequest('Не выбрана статья!')
            }

            const articleData = await BookService.deleteArticle(id)

            if (!articleData) {
                throw ApiError.NotFound('Статья не найдена!')
            }
            return res.status(200).json({
                ...articleData,
                title: 'Статья успешно удалена!',
                description: articleData.result,
            })
        } catch (e) {
            next(e)
        }
    }
}
module.exports = new BooksController()