async function log(req, res, next) {
    const logCollection = req.db.collection("log")
    const isTest = process.argv.includes("TEST")
    try {
        await logCollection.insertOne({
            status: isTest ? 'TEST_Normal' : 'Normal',
            notes: '-',
            src: req.ip,
            endpoint: req.originalUrl,
            date: new Date()
        })
        next()
    } catch (err) {
        await logCollection.insertOne({
            status: isTest ? 'TEST_Error' : 'Error',
            notes: err,
            src: req.ip,
            endpoint: req.originalUrl,
            date: new Date()
        })
        logCollection.insertOne()
    }
}

module.exports = { log }