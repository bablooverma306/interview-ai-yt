const path = require("path")
require("dotenv").config({
    path: path.resolve(__dirname, "../../.env")
})

const isProduction = process.env.NODE_ENV === "production"

const env = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || process.env.MONGO_DB,
    jwtSecret: process.env.JWT_SECRET || (isProduction ? "" : "interview-ai-dev-secret"),
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY,
    clientOrigin: process.env.CLIENT_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173",
    isProduction,
    cookieOptions: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    },
}

if (!env.mongoUri) {
    throw new Error("MONGO_URI or MONGO_DB is required.")
}

if (isProduction && !env.jwtSecret) {
    throw new Error("JWT_SECRET is required in production.")
}

module.exports = env
