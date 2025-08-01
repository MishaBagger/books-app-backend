const Router = require('express').Router
const router = Router()

const AdminController = require('../controllers/admin/adminController.js')
const adminMiddleware = require('../middlewares/admin-middleware.js')

const ServiceController = require('../controllers/admin/ServiceController.js')
const ArticleController = require('../controllers/admin/ArticleController.js')
const VacancyController = require('../controllers/admin/VacancyController.js')
const CourseController = require('../controllers/admin/CourseController.js')
const GalleryController = require('../controllers/admin/GalleryController.js')
const OrderController = require('../controllers/admin/OrderController.js')
const RequestController = require('../controllers/admin/RequestController.js')
const BannerController = require('../controllers/admin/BannerController.js')
const VideoController = require('../controllers/admin/VideoController.js')

const serviceMulterMiddleware = require('../middlewares/service-multer-middleware.js')
const articleMulterMiddleware = require('../middlewares/article-multer-middleware.js')
const vacancyMulterMiddleware = require('../middlewares/vacancy-multer-middleware.js')
const courseMulterMiddleware = require('../middlewares/course-multer-middleware.js')
const galleryMulterMiddleware = require('../middlewares/gallery-multer-middleware.js')
const bannerMulterMiddleware = require('../middlewares/banner-multer-middleware.js')
const videoMulterMiddleware = require('../middlewares/video-multer-middleware.js')


// Общая логика администратора

// Excel-документы
router.get('/users', adminMiddleware, AdminController.getUsers)
router.get('/clients', adminMiddleware, AdminController.getClients)
router.get('/metrics', adminMiddleware, AdminController.getMetrics)

// Заявки на консультацию
router.get('/data/orders', adminMiddleware, OrderController.getAllOrders)
router.get('/orders', adminMiddleware, OrderController.getOrders)
router.delete('/order/:id', adminMiddleware, OrderController.deleteOrder)


// Заявления на обучение
router.get('/data/requests', adminMiddleware, RequestController.getAllRequests)
router.get('/requests', adminMiddleware, RequestController.getRequests)
router.get('/download/request/:id', adminMiddleware, RequestController.downloadRequest)
router.delete('/request/:id', adminMiddleware, RequestController.deleteRequest)


// Слайдер услуг
router.get('/service', adminMiddleware, ServiceController.getService)
router.post('/service', adminMiddleware, serviceMulterMiddleware.single('serviceImage'), ServiceController.addService)
router.patch('/service/:id', adminMiddleware, ServiceController.updateService)
router.delete('/service/:id', adminMiddleware, ServiceController.deleteService)


// Страницы со статьями
router.get('/article', adminMiddleware, ArticleController.getArticle)
router.post('/article', adminMiddleware, articleMulterMiddleware.single('articleImage'), ArticleController.addArticle)
router.patch('/article/:id', adminMiddleware, ArticleController.updateArticle)
router.delete('/article/:id', adminMiddleware, ArticleController.deleteArticle)


// Страницы с вакансиями
router.get('/vacancy', adminMiddleware, VacancyController.getVacancy)
router.post('/vacancy', adminMiddleware, vacancyMulterMiddleware.single('vacancyImage'), VacancyController.addVacancy)
router.patch('/vacancy/:id', adminMiddleware, VacancyController.updateVacancy)
router.delete('/vacancy/:id', adminMiddleware, VacancyController.deleteVacancy)


// Курсы
router.get('/course', adminMiddleware, CourseController.getCourse)
router.post('/course', adminMiddleware, courseMulterMiddleware.single('courseFile'), CourseController.addCourse)
router.patch('/course/:id', adminMiddleware, CourseController.updateCourse)
router.delete('/course/:id', adminMiddleware, CourseController.deleteCourse)


// Фотографии галереи
router.get('/gallery', adminMiddleware, GalleryController.getGallery)
router.post('/gallery', adminMiddleware, galleryMulterMiddleware.single('galleryImage'), GalleryController.addGallery)
router.delete('/gallery/:id', adminMiddleware, GalleryController.deleteGallery)

// Фотографии баннера
router.get('/banner', adminMiddleware, BannerController.getBanner)
router.post('/banner', adminMiddleware, bannerMulterMiddleware.single('bannerImage'), BannerController.addBanner)
router.put('/banner/:id', adminMiddleware, BannerController.activeBanner)
router.delete('/banner/:id', adminMiddleware, BannerController.deleteBanner)

// Видео
router.get('/video', adminMiddleware, VideoController.getVideo)
router.post('/video', adminMiddleware, videoMulterMiddleware.single('videoFile'), VideoController.addVideo)
router.put('/video/:id', adminMiddleware, VideoController.activeVideo)
router.delete('/video/:id', adminMiddleware, VideoController.deleteVideo)

module.exports = router