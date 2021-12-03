import { createContext, useReducer } from "react"

/*
forward = for trowing to home if user logoff
isLoading = to wait until response from check-user is verify
*/
const initState = {
    forward: true,
    isLoading: true,
    isLogin: false,
    user: {}
}
export const AuthContext = createContext()

const reducer = (state, action) => {
    const {type, payload} = action

    switch(type) {
        case "AUTH_SUCCESS":
        case "LOGIN":
            localStorage.setItem("token", payload.token)
            
            return {
                forward: true,
                isLoading: false,
                isLogin: true,
                user: payload
            }
        case "AUTH_ERROR":
        case "LOGOUT":
            localStorage.removeItem("token")
            return {
                forward: true,
                isLoading: false,
                isLogin: false,
                user: {}
            }
        default:
            throw new Error("type doesn't match with case")
    }
}

export const AuthContextProvider = ({children}) => {
    const [stateUser, dispatchUser] = useReducer(reducer, initState)

    return (
        <AuthContext.Provider value={[stateUser, dispatchUser]}>
            {children}
        </AuthContext.Provider>
    )
}