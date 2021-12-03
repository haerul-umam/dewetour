import Footer from "../component/Footer/Footer"
import Header from "../component/Nav/Header"
import Transaction from "../component/Card/Transaction"

import "./css/backgroundNavbar.css"
import { useState, useEffect } from "react"
import { API } from "../config/api"

import {Container, Alert} from "react-bootstrap"

export default function Payment() {
    const [payment, setPayment] = useState([])
    
    const getPayment = async () => {
        try {
            const response = await API.get("/payment")
            setPayment(response.data?.data)
            
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() => {
        getPayment()
    },[])
  
    return (
        <>
        <div className="header-bg">
            <Container>
                <Header/>
            </Container>
        </div>
        <Container className="my-5">
            <Alert variant="info" className="text-center"><i className="fas fa-exclamation me-2"></i>Your payment will be canceled at 24.00 WIB. Please pay before that hour.</Alert>
            {payment.map(pay => {
                return <div key={pay.id} className="mb-4">
                <Transaction data={{transact: pay, showButton: true, forUser: "user", dispatch:getPayment}} />
                </div>
            })}
        </Container>
        <Footer/>
        </>
    )
}
