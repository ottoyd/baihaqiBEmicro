function errHandle(err, req, res, next) {
    // err log
    // sentry
    if (err.code) return res.status(err.code).json({ err: err.message })
    return res.status(500).json({ err: err.message })
}

module.exports = { errHandle }