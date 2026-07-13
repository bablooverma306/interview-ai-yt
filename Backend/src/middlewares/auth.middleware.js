const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const env = require("../config/env")

function getTokenFromRequest(req) {
    const authHeader = req.headers.authorization || ""
    if (authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7).trim()
    }

    return req.cookies.token
}



async function authUser(req, res, next) {
    const token = getTokenFromRequest(req)

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret)

        req.user = decoded

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token."
        })
    }

}


async function optionalAuthUser(req, res, next) {
    const token = getTokenFromRequest(req)

    if (!token) {
        req.user = null
        return next()
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        req.user = null
        return next()
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret)
        req.user = decoded
    } catch (err) {
        req.user = null
    }

    next()
}

module.exports = { authUser, optionalAuthUser }
