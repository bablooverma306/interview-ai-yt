const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const env = require("../config/env")

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function getTokenFromRequest(req) {
    const authHeader = req.headers.authorization || ""
    if (authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7).trim()
    }

    return req.cookies.token
}

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {

    const username = (req.body.username || "").trim()
    const email = (req.body.email || "").trim().toLowerCase()
    const password = req.body.password || ""

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { email },
            { username: { $regex: `^${escapeRegex(username)}$`, $options: "i" } }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        env.jwtSecret,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, env.cookieOptions)


    res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, identifier, password } = req.body
    const loginValue = (identifier || email || "").trim()

    if (!loginValue || !password) {
        return res.status(400).json({
            message: "Please provide email/username and password"
        })
    }

    const user = await userModel.findOne({
        $or: [
            { email: loginValue.toLowerCase() },
            { username: loginValue },
            { username: { $regex: `^${escapeRegex(loginValue)}$`, $options: "i" } },
            { email: { $regex: `^${escapeRegex(loginValue.toLowerCase())}$`, $options: "i" } }
        ]
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email/username or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email/username or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        env.jwtSecret,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, env.cookieOptions)
    res.status(200).json({
        message: "User loggedIn successfully.",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = getTokenFromRequest(req)

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token", env.cookieOptions)

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    if (!req.user?.id) {
        return res.status(200).json({
            message: "No active session",
            user: null
        })
    }

    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(200).json({
            message: "No active session",
            user: null
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
