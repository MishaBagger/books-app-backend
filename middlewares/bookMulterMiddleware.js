const fs = require('fs')
const path = require('path')
const multer = require('multer')
const slugGenerator = require('../utils/slugGenerator.js')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const booksDir = 'public/books/'

        if (!fs.existsSync(booksDir)) {
            fs.mkdirSync(booksDir, { recursive: true })
        }

        cb(null, booksDir)
    },
    filename(req, file, cb) {
        try {
            const originalName = Buffer.from(file.originalname, 'latin1')
                .toString('utf8')
                .toLowerCase()
            const ext = path.extname(originalName)
            const slug = slugGenerator(path.basename(originalName, ext))
            cb(null, `book_${slug}${ext}`)
        } catch (error) {
            cb(error)
        }
    },
})

const types = [
    'image/png',
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/tiff',
]

const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({ storage, fileFilter })
