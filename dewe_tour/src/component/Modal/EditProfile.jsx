import {Modal, Button, Form, Col, Row, Container, FloatingLabel, Image} from "react-bootstrap"
import { useRef, useState } from "react"

export default function Profile(props) {
    const inputImg = useRef(null)
    const [preview, setPreview] = useState(null)
    const [photo, setPhoto] = useState(null)

    
    const onButtonClick = (e)=> {
        e.preventDefault()
        inputImg.current.click()
    }

    const handleChange = (e)=> {
        e.preventDefault()
        
        try{
            if (e.target.type === "file") {
                setPhoto(e.target.files)
                let url = URL.createObjectURL(e.target.files[0])
                setPreview(url)}
        }catch(e){
            console.log(e)
            setPreview(prev => prev)
        }

    }
    
    return (
        <Modal {...props} centered size="lg">
            <Modal.Header closeButton className="px-2 py-0">
                <Modal.Title>
                    <p>Edit Profile</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Form>
                    <Row>
                        <Col md>
                            <Row className="g-2 mb-2">
                                <Col md>
                                    <FloatingLabel label="Full Name">
                                        <Form.Control type="text" name="fullName"/>
                                    </FloatingLabel>
                                </Col>
                                <Col md>
                                    <FloatingLabel label="Email">
                                        <Form.Control type="email" name="email"/>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row className="g-2 mb-2">
                                <Col md>
                                    <FloatingLabel label="Password">
                                        <Form.Control type="password" name="password"/>
                                    </FloatingLabel>
                                </Col>
                                <Col md>
                                    <FloatingLabel label="Phone">
                                        <Form.Control type="text" name="phone"/>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Form.Group className="mb-2">
                                <small className="d-block" style={{color:"#8f9193"}}>Gender</small>
                                <Form.Check inline label="Male" name="gender" value="male" type="radio" />
                                <Form.Check inline label="Female" name="gender" value="female" type="radio"/>
                            </Form.Group>
                            <Row>
                                <Col md>
                                    <FloatingLabel label="Address">
                                    <Form.Control type="text" name="address"/>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <div className="d-flex align-items-center justify-content-center flex-column">
                            {preview &&
                            <Image src={preview} style={{maxHeight:"13.4rem", maxWidth:"100%"}}/>
                            }
                            <Button variant="link" size="sm" onClick={onButtonClick}>select image</Button>
                            </div>
                            <input type="file" ref={inputImg} name="image" accept="image/*" className="d-none" onChange={handleChange}></input>
                        </Col>
                    </Row>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}
