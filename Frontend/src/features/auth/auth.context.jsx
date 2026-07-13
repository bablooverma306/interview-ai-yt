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
    const [loading, setLoading] = useState(true)

    


    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )

    
}
