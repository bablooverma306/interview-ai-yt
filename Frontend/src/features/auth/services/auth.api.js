import { api } from "../../../lib/api"

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {
        throw err?.response?.data?.message || err?.message || "Registration failed"

    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        throw err?.response?.data?.message || err?.message || "Login failed"
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {
        throw err?.response?.data?.message || err?.message || "Logout failed"
    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        throw err?.response?.data?.message || err?.message || "Session check failed"
    }

}
