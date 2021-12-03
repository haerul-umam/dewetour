import { useEffect, useState, useContext } from "react"
import { useParams, useHistory } from "react-router-dom"
import { API } from "../config/api"
import { AuthContext } from "../context/authContext"

import Header from "../component/Nav/Header"
import TripInfo from "../component/Icon/TripInfo"
import Footer from "../component/Footer/Footer"

import "./css/backgroundNavbar.css"
import style from "./css/TourDetail.module.css"
import {Container, Row, Col, Image, Button} from "react-bootstrap"

import {NotificationContainer, NotificationManager} from 'react-notifications';
import { ModalContext } from "../context/modalContext"

export default function TourDetail() {
    const { id } = useParams()
    const [trip, setTrip] = useState(null)
    const [qty, setQty] = useState(1)
    const [total, setTotal] = useState(0)
    const [stateUser, ] = useContext(AuthContext)
    const [, setModal] = useContext(ModalContext)
 
    const increment = () =>{
        let remainingQuota = trip?.quota - trip?.quota_filled
        
        if ((qty) === remainingQuota){
            NotificationManager.warning("Reach max quota", `quota ${remainingQuota}`)
            console.log("tes")
        }

        setQty(prevQty => prevQty < remainingQuota ? prevQty +1  : prevQty)
        setTotal(preTotal => qty < remainingQuota ? preTotal + trip?.price : preTotal)
    }
    const decrement = () =>{
        setQty(prevQty => prevQty <= 1 ? prevQty : prevQty - 1)
        setTotal(preTotal => qty <= 1 ? preTotal : preTotal - trip?.price)
    }

    const getTrip = async (id) => {
        try {
            const response = await API.get(`/trip/${id}`)
            setTrip(response.data.data)
            setTotal(response.data.data.price)
        }catch(e){
            console.log(e)
        }
    }

    let history = useHistory()
    
    const buying = async () => {
        try {
            let data = {
                reservation: qty,
                price: trip?.price,
                trip_id: id
            }
          
            const body = JSON.stringify(data)

            const config = {
                headers: {
                    "Content-Type": "application/json"}
            }
            const response = await API.post("/transaction", body, config)

            
            if (response.status === 200){
                NotificationManager.success(`Success booking`, `klik here to pay`,3000,() =>{
                    history.push("/payment")
                })
            }
        }catch(e) {
            NotificationManager.warning(`${e.response.data.status}`, `${e.response.data.message}`)
        }
    }
    const checkUser = () =>{   //if not login, show login modal when klik book
        if (!stateUser.isLogin) {
            setModal({type:"login",payload:true})
        }else{
            buying()
        }
    }

    useEffect(() => {
        getTrip(id)
        //eslint-disable-next-line
    },[])


    return (
        <>  
        <div className="header-bg">
            <Container>
                <Header/>
            </Container>
        </div>
        {trip && (
            <>
            <Container className="mt-5">
                <h1 className={style.Title}>{trip.title}</h1>
                <p className={style.Nation}>{trip.country.name}</p>
                <Row>
                    <Col md={12}>
                        <Image src={trip["image"][0]} rounded className={style.ImageTop}/>
                    </Col>
                </Row>
                <Row>
                    {trip["image"].slice(1).map((img) => {
                        return (
                        <Col key={img}>
                            <Image src={img} rounded className={style.ImageSmall}/>
                        </Col>)
                    })}
                </Row>
                <p className="fw-bold my-4" style={{fontSize:"1.125rem"}}>Information Trip</p>
                <div className="d-flex justify-content-between">
                    <TripInfo menu="Accomodation" img="hotel 1.png" data={trip.accommodation}/>
                    <TripInfo menu="Transportation" img="plane 1.png" data={trip.transportation}/>
                    <TripInfo menu="Eat" img="meal 1.png" data={trip.eat}/>
                    <TripInfo menu="Duration" img="time 1.png" data={`${trip.day} Days ${trip.night} Nights`}/>
                    <TripInfo menu="Date Trip" img="calendar 1.png" data={trip.dateTrip}/>
                </div>
                <p className="fw-bold title-info mt-5" style={{fontSize:"1.125rem"}}>Description</p>
                <p className="font-grey">{trip.description}</p>
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <h3 className="font-yellow fw-bold me-3">IDR. {trip.price.toLocaleString("id-ID")}
                        </h3>
                        <h3 className="fw-bold">/ Person</h3>
                    </div>
                    <div className="d-flex flex-row-reverse text-center">
                        <button className="shadow-none btn btn-sm" onClick={increment}>
                            <Image src="/assets/icons/Plus.png"/>
                        </button>
                        <input type="text" name="quantity" readOnly value={qty} className={style.Reservation}/>
                        <button className="shadow-none btn btn-sm" onClick={decrement}>
                            <Image src="/assets/icons/Minus.png"/>
                        </button>
                    </div>
                </div>
                <hr/>
                <div className="d-flex justify-content-between">
                    <h3 className="fw-bold ">Total :</h3>
                    <h3 className="font-yellow fw-bold me-3">IDR. {total?.toLocaleString("id-ID")}</h3>
                </div>
                <hr/>
                <Button variant="warning" className="float-end fw-bold text-light" style={{marginBottom:"7rem"}} onClick={checkUser}>BOOK NOW</Button>
            </Container>
            <Footer/>
            <NotificationContainer/>
            </>
        )}

        {!trip && <div>loading...</div>}
        </>
    )
}
