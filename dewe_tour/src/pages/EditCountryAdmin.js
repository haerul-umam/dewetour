import Footer from "../component/Footer/Footer"
import Header from "../component/Nav/Header"

import "./css/backgroundNavbar.css"
import style from "./css/AddTrip.module.css"
import { useState, useEffect } from "react"
import { API } from "../config/api"

import {Container, Button, Form} from "react-bootstrap"
import {NotificationContainer, NotificationManager} from "react-notifications"
import { useHistory, useParams } from "react-router-dom"

import { titleCase } from "../functions"

export default function EditCountryAdmin() {
    const {id} = useParams()
    const [country, setCountry] = useState("")
    let history = useHistory()

    const getData = async ()=> {
        try{
            const response = await API.get("/country/" + id)
            setCountry(response.data.data.name)
        
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() =>{
        getData()
        //eslint-disable-next-line
    },[])

    const handleChange = (e) => {
        setCountry(prev => titleCase(e.target.value))
    }

    const handleSubmit = async () =>{
        try{
            const config = {
                headers : {"Content-Type":"application/json"}
            }
            let data = JSON.stringify({country: country})

            const response = await API.put("/country/" +id, data, config)
           
            if (response.status === 200){
                
                NotificationManager.success(
                    "klik here to back",
                    "Success edit trip",
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
        <h2 className="fw-bold mb-4">Edit Country</h2>
        <div className="d-flex flex-column mb-3">
            <label className={style.Label}>Name</label>
            <Form.Control id="country" name="country" value={country} className={style.FormControl} onChange={handleChange}/>
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
