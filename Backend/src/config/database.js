const mongoose = require("mongoose")
const env = require("./env")


async function connectToDB() {

    try {
        await mongoose.connect(env.mongoUri)

        console.log("Connected to Database")
    }
    catch (err) {
        console.error("Database connection failed:", err.message)

        const fallbackMongoUri = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/interview-ai-yt"

        if (!env.isProduction && env.mongoUri !== fallbackMongoUri) {
            try {
                await mongoose.connect(fallbackMongoUri)
                console.log("Connected to local fallback database")
                return
            }
            catch (fallbackErr) {
                console.error("Fallback database connection failed:", fallbackErr.message)
                throw fallbackErr
            }
        }

        throw err
    }
}

module.exports = connectToDB
