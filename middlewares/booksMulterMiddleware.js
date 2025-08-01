const multer = require('multer')
const path = require('path')
const slugGenerator = require('../utils/slugGenerator.js')


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/books/')
    },
    filename(req, file, cb) {
        try {
            const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8').toLowerCase();
            const ext = path.extname(originalName)
            const gallerySlug = slugGenerator(path.basename(originalName, ext))
            cb(null, `books_${gallerySlug}${ext}`)
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