import { createContext, useReducer } from "react";

const initValue = {
    loginShow : false,
    registerShow: false
}

export const ModalContext = createContext()

const reducer = (state, action) => {
    const {type, payload} = action
    switch (type){
    case "login":
        return {...state, loginShow: payload};
    case "register":
        return {...state, registerShow: payload};
    case "close":
        return {loginShow: false, registerShow: false};
    default:
            throw new Error("type doesn't match modalContext")
    }
}

export const ModalContextProvider = ({children}) => {
    const [modalShow, setModal] = useReducer(reducer, initValue)

    return (
        <ModalContext.Provider value={[modalShow, setModal]}>
            {children}
        </ModalContext.Provider>
    )
}