const env = require("./src/config/env")
const app = require("./src/app")
const connectToDB = require("./src/config/database")

async function startServer() {
    await connectToDB()

    app.listen(env.port, () => {
        console.log(`Server is running on port ${env.port}`)
    })
}

startServer().catch((error) => {
    console.error("Failed to start server:", error)
    process.exit(1)
})
