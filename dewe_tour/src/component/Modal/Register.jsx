import { Modal, Form, Button } from "react-bootstrap"
import style from "./Auth.module.css"
import { useState } from "react"
import { API } from "../../config/api"

let image = {palm:"/assets/images/palm.png",flower:"/assets/images/flower.png"}

export default function Register({modal}) {
    const [msg, setMsg] = useState(null)

    const [form, setForm] = useState({
        fullName :"",
        email:"",
        password:"",
        phone:"",
        address:""
    })

    const handleInput = (e)=>{
        setForm((prev) => ({
          ...prev, [e.target.name] : e.target.value
        }))
    }

    const handleCheckbox = (e) => {
        setForm((prev) => ({
            ...prev, gender : e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }

            const body = JSON.stringify(form)

            const response = await API.post("/register", body, config) 
            console.log(response)
            if (response.status === 200){
                setMsg(alert("register success, klik login to continue", "success"))
            }


        }catch(e) {
          console.log(e)
          setMsg(alert(e.response.data["message"], "danger"))
        }
    }
    const showLogin = () => {
        modal.setModal({ type: "register", payload: false });
        modal.setModal({ type: "login", payload: true });
    };

    const alert = (text, type) =>{
        return <small className={`text-${type}`}>{text}</small>
    }

    return (
        <Modal show={modal.show} onHide={modal.closeModal} dialogClassName={style.ModalAuth} centered>
            <Modal.Body className={`${style.ModelBody}`}>
                <img src={image.palm} alt="palm" />
                <img src={image.flower} alt="flower" />
                <h2 className="text-center mt-5 fw-bold">Register</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicFullName">
                        <Form.Label className="ps-2 fw-bold">Fullname</Form.Label>
                        <Form.Control type="text" name="fullName" className={`${style.Input}`} onChange={handleInput} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="ps-2 fw-bold">Email</Form.Label>
                        <Form.Control type="email" name="email" className={`${style.Input}`} onChange={handleInput} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="ps-2 fw-bold">Password</Form.Label>
                        <Form.Control type="password" name="password" className={`${style.Input}`} onChange={handleInput} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Label className="ps-2 fw-bold">Phone</Form.Label>
                        <Form.Control type="text" name="phone" className={`${style.Input}`} onChange={handleInput} required/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="ps-2 fw-bold d-block">Gender</Form.Label>
                        <Form.Check inline label="Male" name="gender" value="male" type="radio" onChange={handleCheckbox} />
                        <Form.Check inline label="Female" name="gender" value="female" type="radio" onChange={handleCheckbox} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Label className="ps-2 fw-bold">Address</Form.Label>
                        <Form.Control type="text" name="address" className={`${style.Input}`} onChange={handleInput} required/>
                    </Form.Group>
                    <div className="text-center">{msg && msg}</div>
                    <Button variant="warning" type="submit" className="text-light mb-3 fw-bold w-100">Register</Button>
                    <p className="text-center font-grey">Already a member ? klik
                    <Button size="sm" className="fw-bold font-grey" variant="light" onClick={showLogin}>Login</Button>
                    </p>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
