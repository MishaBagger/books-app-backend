function dateGenerator(date) {
    const [day, month, year] = date.split('.')
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString()

    return isoDate
}

module.exports = dateGenerator
