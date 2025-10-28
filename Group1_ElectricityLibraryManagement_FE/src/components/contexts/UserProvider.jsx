import { useState, useReducer, useEffect, useContext, use } from "react";
import UserContext from "./UserContext";
import { jwtDecode } from "jwt-decode";

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);

                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log("Token has expired");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    return;
                }

                const userExtracted = {
                    username: decodedToken.sub,
                    role: decodedToken.role,
                    accountId: decodedToken.accountId,
                };
                setUser(userExtracted);

            }catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
            finally{
                setLoading(false);
            }
        }
        setLoading(false);
    }, []);

    const setUserContext = (user) => {
        setUser(user);
    }

    const contextValue = {
        user,
        loading,
        setUserContext,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(UserContext);
}
