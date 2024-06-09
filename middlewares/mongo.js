const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(`mongodb+srv://${process.env.MONGO_HOST}`, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function database(req, res, next) {
    try {
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        req.db = client.db(process.env.DB_NAME);
        res.on('finish', async () => {
            await client.close();
        });
        next();
    } catch (e) {
        console.log(e);
        res.status(500).json({err: 'Failed Connect to DB'})
    }
}


module.exports = { database }