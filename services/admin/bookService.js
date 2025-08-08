const BookModel = require('../../models/bookModel.js')
const path = require('path')
const fs = require('fs')

class BookService {
    async getBooks() {
        try {
            const books = await BookModel.findAll({
                attributes: ['id', 'title', 'description', 'image', 'date'],
                order: [
                    ['date', 'DESC'], // Сначала по дате (новые сверху)
                    ['title', 'ASC'], // Затем по алфавиту
                ],
            })
            return books
        } catch (error) {
            throw error
        }
    }

    async addBook(slug, title, description, date, image, link, platform) {
        try {
            const book = await BookModel.create({
                slug,
                title,
                description,
                date,
                image,
                link,
                platform,
            })
            return {
                ...book,
                success: true,
            }
        } catch (error) {
            throw error
        }
    }

    async updateBook(id, title, description, date, link, platform) {
        try {
            const book = await BookModel.findByPk(id)

            const updates = {}

            if (title) updates.title = title
            if (description) updates.description = description
            if (date) updates.date = date
            if (link) updates.link = link
            if (platform) updates.platform = platform

            // Обновляем только если есть изменения
            if (Object.keys(updates).length > 0) {
                await book.update(updates)
            }
            return {
                ...book,
                success: true,
            }
        } catch (error) {
            throw error
        }
    }

    async deleteBook(id) {
        try {
            // Сначала находим книгу по id
            const book = await BookModel.findOne({
                where: { id },
            })

            // Если книга найдена, получаем имя изображения
            if (book) {
                const imageName = book.image

                // Сервис для удаления файла
                const result = await deleteImageFile(imageName)

                async function deleteImageFile(imageName) {
                    const filePath = path.join(
                        __dirname,
                        '..',
                        '..',
                        'public',
                        'books',
                        imageName
                    )

                    try {
                        await fs.promises.unlink(filePath)
                        const success = `Файл ${imageName} удален с сервера.`
                        return success
                    } catch (error) {
                        const failed = `Ошибка при удалении файла ${imageName}: фотография не найдена`
                        return failed
                    }
                }

                // Затем удаляем запись из базы данных
                const deleted = await BookModel.destroy({
                    where: { id },
                })

                return { result, success: deleted > 0, book } // Возвращаем true, если запись была удалена
            }
            return false // Если запись не найдена, возвращаем false
        } catch (error) {
            throw error
        }
    }
}
module.exports = new BookService()
