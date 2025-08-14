const { DataTypes } = require('sequelize')
const sequelize = require('../controllers/database.js')

const Metric = sequelize.define(
    'Metric',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        period: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'metrics',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    }
)

// Основные метрики которые должны быть
const REQUIRED_METRICS = [
    { name: 'registered_users', period: 'all_time' },
    { name: 'registered_users', period: 'monthly' },
    { name: 'visits', period: 'all_time' },
    { name: 'visits', period: 'monthly' },
    { name: 'redirects', period: 'all_time' },
    { name: 'redirects', period: 'monthly' },
]

// Инициализация метрик
Metric.initMetrics = async function () {
    try {
        // Создаем/обновляем все необходимые метрики
        for (const metric of REQUIRED_METRICS) {
            await this.findOrCreate({
                where: {
                    name: metric.name,
                    period: metric.period,
                },
                defaults: {
                    value: 0,
                },
            })
        }
    } catch (error) {
        console.error('Ошибка инициализации метрик: ', error)
    }
}

// Обновление счетчиков пользователей
Metric.updateUserCount = async function () {
    try {
        const userCount = await sequelize.models.User.count()

        const [metric, created] = await this.findOrCreate({
            where: {
                name: 'registered_users',
                period: 'all_time',
            },
            defaults: {
                value: userCount,
            },
        })

        if (!created) {
            await metric.update({ value: userCount })
        }

        setTimeout(() => {
            console.log('Количество пользователей обновлено:', userCount)
        }, 1000)
    } catch (error) {
        console.error('Ошибка обновления количества пользователей: ', error)
    }
}

// Ежемесячный сброс monthly счетчиков
Metric.resetMonthlyCounters = async function () {
    try {
        // Получаем все monthly метрики
        const monthlyMetrics = await this.findAll({
            where: {
                period: 'monthly',
            },
        })

        // Для каждой monthly метрики находим all_time и обновляем
        for (const metric of monthlyMetrics) {
            const allTimeMetric = await this.findOne({
                where: {
                    name: metric.name,
                    period: 'all_time',
                },
            })

            if (allTimeMetric) {
                // Увеличиваем all_time на значение monthly
                await allTimeMetric.increment('value', { by: metric.value })
            }

            // Сбрасываем monthly
            await metric.update({ value: 0 })
        }

        console.log('Счетчики месяцев обновлены')
    } catch (error) {
        console.error('Ошибка обновления счетчиков месяцев: ', error)
    }
}

// Планировщик для ежемесячного сброса
Metric.startScheduler = function () {
    // Вычисляем время до конца текущего месяца
    const now = new Date()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    endOfMonth.setHours(23, 59, 59, 999)

    const timeUntilEndOfMonth = endOfMonth - now

    // Запускаем таймер на конец месяца
    setTimeout(async () => {
        await Metric.resetMonthlyCounters()

        // Затем устанавливаем регулярный интервал (каждый месяц)
        Metric.scheduler = setInterval(
            () => Metric.resetMonthlyCounters(),
            30 * 24 * 60 * 60 * 1000 // ~1 месяц
        )
    }, timeUntilEndOfMonth)
}

// Автоматическая инициализация при подключении модели
Metric.afterSync(async () => {
    await Metric.initMetrics()
    await Metric.updateUserCount()
    Metric.startScheduler()

    // Также обновляем счетчики каждые 12 часов
    Metric.updateInterval = setInterval(
        () => Metric.updateUserCount(),
        12 * 60 * 60 * 1000
    )
})

module.exports = Metric
