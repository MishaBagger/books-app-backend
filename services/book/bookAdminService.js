const BookModel = require('../../models/bookModel.js')
const deleteImageFile = require('../../utils/deleteImageFile.js')

class bookAdminService {
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

    async updateBook(
        id,
        slug,
        title,
        description,
        date,
        image,
        link,
        platform
    ) {
        try {
            const book = await BookModel.findByPk(id)

            const updates = {}

            if (image) {
                await deleteImageFile(book)
                updates.image = image
            }

            if (slug) updates.slug = slug
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
            const book = await BookModel.findByPk(id)

            // Если книга найдена, получаем имя изображения
            if (book) {
                const message = await deleteImageFile(book)
                // Затем удаляем запись из базы данных
                const deleted = await BookModel.destroy({
                    where: { id },
                })

                return { message, success: deleted > 0, book } // Возвращаем true, если запись была удалена
            }
            return false // Если запись не найдена, возвращаем false
        } catch (error) {
            throw error
        }
    }
}

module.exports = new bookAdminService()
