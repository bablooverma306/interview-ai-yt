import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const persistUser = (nextUser) => {
        setUser(nextUser)
        if (nextUser) {
            localStorage.setItem("auth_user", JSON.stringify(nextUser))
        } else {
            localStorage.removeItem("auth_user")
        }
    }


    const handleLogin = async ({ identifier, email, password }) => {
        setLoading(true)
        try {
            const data = await login({ identifier, email, password })
            if (data?.user) {
                persistUser(data.user)
                return { ok: true, data }
            }
            persistUser(null)
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
                return { ok: true, data }
            }
            persistUser(null)
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
                } else {
                    persistUser(null)
                }
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}
