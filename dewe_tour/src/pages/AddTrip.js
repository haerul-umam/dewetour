import { Form, Row, Col, Container, Image } from "react-bootstrap"
import "./css/backgroundNavbar.css"
import style from "./css/AddTrip.module.css"

import Footer from "../component/Footer/Footer"
import Header from "../component/Nav/Header"

import {NotificationContainer, NotificationManager} from 'react-notifications';
import { useRef, useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import {Button} from "react-bootstrap"
import { API } from "../config/api"

export default function AddTrip() {
    let history = useHistory()

    const inputImg = useRef(null)
    const [countries, setCountries] = useState([])
    const [preview, setPreview] = useState([])
    const [form, setForm] = useState({
        title: "",
        country: "",
        accommodation: "",
        transportation: "",
        eat: "",
        day: "",
        night: "",
        dateTrip: "",
        price: "",
        quota: "",
        description: "",
        image: ""
    })

    const getCountries = async ()=> {
        try{
            const response = await API.get("/countries")
          
            setCountries(response.data.data)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() => {
        getCountries()
    }, [])

    const onButtonClick = (e)=> {
        e.preventDefault()
        inputImg.current.click()
    }

    const handleChange = (e) => {
        
        try{

            setForm({
                ...form,
                [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value
            })

            if (e.target.type === "file" && e.target.files.length > 0) {
                let images = []
                for (let i=0; i < e.target.files.length; i++){
                    let url = URL.createObjectURL(e.target.files[i])
                    images.push(url)
                }
                setPreview(images)
            }
        }catch(e){
            console.log(e)
            setPreview(prev => prev)
        }
    }
    
    const handleSubmit = async (e)=> {
        try{
            e.preventDefault()

            const config ={
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

            const formData = new FormData()
            formData.set("title",form.title)
            formData.set("country_id",form.country)
            formData.set("accommodation",form.accommodation)
            formData.set("transportation",form.transportation)
            formData.set("eat",form.eat)
            formData.set("day",form.day)
            formData.set("night",form.night)
            formData.set("dateTrip",form.dateTrip)
            formData.set("price",form.price)
            formData.set("quota",form.quota)
            formData.set("description",form.description)

            for (let i=0; i < form.image.length; i++){
                formData.append("image",form.image[i])
            }

            console.log(form)

            const response = await API.post("/trip", formData, config)

            if (response.status === 200){
                
                NotificationManager.success(
                    "klik here to back",
                    "Success add trip",
                    5000, 
                    () => {history.push("/master-data")}
                )
            }

            
        }catch(e){
            NotificationManager.warning(`${e.response?.data.message}`)
            console.log(e.response.data.message)
        }
    }
    return (
        <>
        <div className="header-bg">
            <Container>
                <Header/>
            </Container>
        </div>
        <div className="container mt-5">
            <h2 className="fw-bold mb-4">Add Trip</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Title trip</Form.Label>
                    <Form.Control className={style.FormControl} type="text" name="title" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Country</Form.Label>
                    <select className={`${style.Select} ${style.Theme} d-block`} defaultValue={"DEFAULT"} name="country" onChange={handleChange}>
                        <option value="DEFAULT" disabled>Select Country</option>
                        {
                            countries.map(val => {
                                return <option key={val.id} value={val.id}>{val.name}</option>
                            })
                        }
                    </select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Accommodation</Form.Label>
                    <Form.Control className={style.FormControl}  type="text" name="accommodation" onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Transportation</Form.Label>
                    <Form.Control className={style.FormControl}  type="text" name="transportation" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Eat</Form.Label>
                    <Form.Control className={style.FormControl} type="text" name="eat" onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Duration</Form.Label>
                    <Row>
                        <Col sm={2}>
                        <Form.Control className={style.FormControl} type="number" name="day" onChange={handleChange} />
                        </Col>
                        <Form.Label className={style.Label} column sm={1}>Day</Form.Label>
                        <Col sm={2}>
                        <Form.Control className={style.FormControl} type="number" name="night" onChange={handleChange} />
                        </Col>
                        <Form.Label className={style.Label} column sm={1}>Night</Form.Label>
                    </Row>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Date Trip</Form.Label>
                    <Form.Control className={style.FormControl}  type="date" name="dateTrip" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Price</Form.Label>
                    <Form.Control className={style.FormControl}  type="number" name="price" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Quota</Form.Label>
                    <Form.Control className={style.FormControl} type="number" name="quota" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Description</Form.Label>
                    <Form.Control className={style.FormControl}  as="textarea" rows={3} style={{resize:"none"}} name="description" onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className={style.Label}>Image</Form.Label>
                    <input multiple type="file" accept="image/*" ref={inputImg} onChange={handleChange} name="image" className="d-none"/>
                    <button className={`${style.ButtonFile} d-block text-warning fw-bold`} onClick={onButtonClick}>Attach file
                    <img src="/assets/icons/attach.png" alt="attach" className={style.ImageButton} />
                    </button>
                </Form.Group>
                {preview.map((val,i) => {
                    return <Image key={i} src={val} className={style.ImagePreview}/>
                })}
                <div className="text-center mb-5">
                <Button variant="warning" type="submit" className="text-light fw-bold w-25">Add Trip</Button>
                </div>
            </Form>
        </div>
        <NotificationContainer/>
        <Footer/>
        </>
    )
}
