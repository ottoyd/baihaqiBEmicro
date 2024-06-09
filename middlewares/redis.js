const { createClient } = require('redis')

async function redis(req, res, next) {

    const client = createClient({
        url: process.env.REDIS_URL
    });

    client.on('error', err => console.log('Redis Client Error', err));
    client.on('connect', err => console.log('Redis Client Connected'));

    try {
        await client.connect();
        req.redis = client
        res.on('finish', async () => {
            await client.quit();
        });
        next();
    } catch (e) {
        console.log(e);
        res.status(500).json({ err: 'Failed Connect to Redis' })
    }
}


module.exports = { redis }