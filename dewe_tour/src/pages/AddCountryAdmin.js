import Footer from "../component/Footer/Footer"
import Header from "../component/Nav/Header"

import "./css/backgroundNavbar.css"
import style from "./css/AddTrip.module.css"
import { useState } from "react"
import { API } from "../config/api"

import {Container, Button, Form} from "react-bootstrap"
import {NotificationContainer, NotificationManager} from "react-notifications"
import { useHistory } from "react-router-dom"

import { titleCase } from "../functions"

export default function AddCountryAdmin() {
    const [country, setCountry] = useState({country:""})
    let history = useHistory()

    const handleChange = (e) => {
        setCountry(prev => ({[e.target.name] : titleCase(e.target.value)}))
    }

    const handleSubmit = async () =>{
        try{
            const config = {
                headers : {"Content-Type":"application/json"}
            }
            let data = JSON.stringify(country)

            const response = await API.post("/country", data, config)
            console.log(data) 
            if (response.status === 200){
                
                NotificationManager.success(
                    "klik here to back",
                    "Success add trip",
                    5000, 
                    () => {history.push("/master-data")}
                )
            }

        }catch(e){
            NotificationManager.warning(e.response?.data.message)
            console.log(e)
        }
    }
  
    return (
        <>
        <div className="header-bg">
            <Container>
                <Header/>
            </Container>
        </div>
        <Container className="my-5">
        <h2 className="fw-bold mb-4">Add Country</h2>
        <div className="d-flex flex-column mb-3">
            <label className={style.Label}>Name</label>
            <Form.Control id="country" name="country" className={style.FormControl} onChange={handleChange}/>
        </div>
        <div className="text-start">
            <Button variant="warning" onClick={handleSubmit} className="text-light fw-bold">Submit</Button>
        </div>
        </Container>
        <NotificationContainer/>
        <Footer/>
        </>
    )
}
