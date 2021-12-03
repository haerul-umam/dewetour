import { Modal, Form, Button } from "react-bootstrap"
import style from "./Auth.module.css"

import { AuthContext } from "../../context/authContext"
import { useContext, useState } from "react"
import { API, setAuthToken } from "../../config/api"
import {useHistory} from "react-router-dom"

let image = {palm:"/assets/images/palm.png",flower:"/assets/images/flower.png"}

export default function Login({modal}) {
 
    const [, dispatchUser] = useContext(AuthContext)
    const [msg, setMsg] = useState(null)
    const [form, setForm] = useState({email: "", password:""})

    const handleInput = (e) =>{
        setForm(prev =>({
          ...prev, [e.target.name] : e.target.value
        }))
    }

    const alert = (text) =>{
        return <small className="text-danger">{text}</small>
    }

    let history = useHistory()
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }

            const body = JSON.stringify(form)

            const response = await API.post("/login", body, config) 
         
            if (response?.status === 200) {
                modal.closeModal()

                setAuthToken(response?.data.data.token)

                await dispatchUser({
                    type: "LOGIN",
                    payload: response.data.data
                })
               
                if (response.data.data.role === "admin"){
                    history.push("/master-data")
                    // push to admin page
                }
            }

        }catch(e) {
          console.log(e)
          setMsg(alert(e.response.data["message"]))
        }
    }

    const showRegister = () => {
        modal.setModal({ type: "register", payload: true });
        modal.setModal({ type: "login", payload: false });
    };

    const closeModal = () => {
        modal.closeModal()
        setMsg(null)
    }
    return (
        <Modal show={modal.show} onHide={closeModal} dialogClassName={style.ModalAuth} centered>
            <Modal.Body className={`${style.ModelBody}`}>
                <img src={image.palm} alt="palm" />
                <img src={image.flower} alt="flower" />
                <h2 className="text-center mt-5 fw-bold">Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="ps-2 fw-bold">Email</Form.Label>
                        <Form.Control type="email" name="email" className={`${style.Input}`} onInput={handleInput} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="ps-2 fw-bold">Password</Form.Label>
                        <Form.Control type="password" name="password" className={`${style.Input}`} onChange={handleInput} required/>
                    </Form.Group>
                    <div className="text-center">{msg && msg}</div>
                    
                    <Button variant="warning" type="submit" className="text-light mb-3 fw-bold w-100 mt-1">Login</Button>
                    <p className="text-center font-grey">Don't have an account ? klik
                    <Button size="sm" className="fw-bold font-grey" variant="light" onClick={showRegister} >Register</Button>
                    </p>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
