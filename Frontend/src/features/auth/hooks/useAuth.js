import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, setToken, loading, setLoading } = context

    const persistUser = (nextUser) => {
        setUser(nextUser)
        if (nextUser) {
            localStorage.setItem("auth_user", JSON.stringify(nextUser))
        } else {
            localStorage.removeItem("auth_user")
        }
    }

    const persistToken = (nextToken) => {
        setToken(nextToken || "")
        if (nextToken) {
            localStorage.setItem("auth_token", nextToken)
        } else {
            localStorage.removeItem("auth_token")
        }
    }


    const handleLogin = async ({ identifier, email, password }) => {
        setLoading(true)
        try {
            const data = await login({ identifier, email, password })
            if (data?.user) {
                persistUser(data.user)
                persistToken(data.token)
                return { ok: true, data }
            }
            persistUser(null)
            persistToken(null)
            return { ok: false, error: "Login failed" }
        } catch (err) {
            return { ok: false, error: err }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data?.user) {
                persistUser(data.user)
                persistToken(data.token)
                return { ok: true, data }
            }
            persistUser(null)
            persistToken(null)
            return { ok: false, error: "Registration failed" }
        } catch (err) {
            return { ok: false, error: err }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            persistUser(null)
            persistToken(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                if (data?.user) {
                    persistUser(data.user)
                    if (data?.token) {
                        persistToken(data.token)
                    }
                } else {
                    persistUser(null)
                    persistToken(null)
                }
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, token, loading, handleRegister, handleLogin, handleLogout }
}
