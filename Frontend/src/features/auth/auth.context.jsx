import { createContext,useState } from "react";


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("auth_user")
            return storedUser ? JSON.parse(storedUser) : null
        } catch (err) {
            return null
        }
    })
    const [token, setToken] = useState(() => localStorage.getItem("auth_token") || "")
    const [loading, setLoading] = useState(true)

    


    return (
        <AuthContext.Provider value={{user,setUser,token,setToken,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )

    
}
