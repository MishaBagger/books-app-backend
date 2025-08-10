const path = require('path')
const fs = require('fs')

async function deleteImageFile(book) {
    if (!book?.image) return

    const imageName = book.image

    const filePath = path.join(__dirname, '..', 'public', 'books', imageName)

    try {
        await fs.promises.unlink(filePath)
        return `Файл ${imageName} удален с сервера.`
    } catch (error) {
        return `Ошибка при удалении файла ${imageName}: фотография не найдена`
    }
}

module.exports = deleteImageFile
