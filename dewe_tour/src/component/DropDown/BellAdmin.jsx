import { Dropdown } from "react-bootstrap";
import "./DropDown.css"

import React, { useEffect, useContext, useState } from "react";
import {AuthContext} from "../../context/authContext"
import {io} from "socket.io-client"
import { API } from "../../config/api";
import {NotificationContainer, NotificationManager} from 'react-notifications';



let socket
export default function Bell() {
    const [stateUser,] = useContext(AuthContext)
    const [payment, setPayment] = useState([])
    
    const loadWaitingPayment = () => {
        socket.emit("load payment")
        socket.on("get payment", (data) => {
            setPayment(data)
        })

    }

    useEffect(() => {
       
        socket = io("http://127.0.0.1:4000", {
            auth: {
                token: localStorage.getItem("token")
            },
            query: {
                mail: stateUser.user.email
            }
        })

        socket.on("connect_error", (err) =>{
            console.log("ada error",err.message)
        })

        loadWaitingPayment()

        socket.on("new payment", () => {
            socket.emit("load payment")
        })

        socket.on("get update read", () => {
            socket.emit("load payment")
        })

        socket.on("mark as read after action", () => {
            socket.emit("load payment")
        })

        return () => {
            socket.disconnect()
        }
        //eslint-disable-next-line
    },[])


    const updatePayment = async (id,status) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
    
            const formData = new FormData()
            formData.set("status",status)

            const response = await API.put("/transaction/" + id + "/status", formData, config)

            console.log(response.data.data)
            if (response.status === 200){
                NotificationManager.success(response.data.message,"",1000)
                socket.emit("update status mark as read", id)
                socket.emit("update payment", response.data.data)
            }


        }catch(e) {
          console.log(e)
          NotificationManager.warning(`${e.response?.data.message}`)
        }
    }

    const openProof = (link) => {
        const newWindow = window.open(link, "_blank", "noopener noreferrer")
        if (newWindow) newWindow.opener = null
    }

    const markAsRead = () => {
        let arrayId = payment.map(val => val.id)
        arrayId.forEach(id => (socket.emit("update read", id, stateUser.user.email)))
    }

    return (
        <Dropdown className="me-4" >
            <Dropdown.Toggle variant="light" style={{height:"50px"}} id="dropdown-basic">
                {
                    payment.length > 0 ? 
                    <i className="fas fa-comment-dollar">
                    <div className="dot"></div>
                    </i>
                    :
                    <i className="fas fa-comment-dollar"></i>
                }
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
                <div className="notif-wrapper">
                        {payment.map(val => (
                            <React.Fragment key={val.id}>
                            <div onDoubleClick={()=> { 
                                openProof(val.attachment)
                             }}
                            className="d-flex flex-column notif-card">
                                <small className="fs-10">Payment : {val.transaction.status}</small>
                                <small className="fs-12">{val.transactionDate}</small>
                                <small className="fw-bold fs-12 title-trip">{val.transaction.trip.title}</small>
                                <small className="fw-bold fs-12">{val.transaction.customer.fullName }</small>
                                <div className="d-flex justify-content-around">
                                    <button onClick={ ()=>{
                                        updatePayment(val.transaction.id,"Cancel")} } 
                                        className="btn btn-sm fs-12 btn-danger px-1 py-0">cancel</button>
                                    <button onClick={ ()=>{
                                        updatePayment(val.transaction.id,"Approved")} } 
                                        className="btn btn-sm fs-12 btn-success px-1 py-0">approve</button>
                                </div>
                            </div>
                            <hr className="my-1"/>
                            </React.Fragment>
                        ))
                        }
                </div>
                {
                    payment.length > 0 ? 
                    <p className="m-0 fs-12 text-primary text-center mark-text" onClick={markAsRead}>Mark all as read</p>
                    :
                    <p className="m-0 fs-12 text-primary text-center">No payment to approve</p>
                }                
                    
            </Dropdown.Menu>
            <NotificationContainer/>
        </Dropdown>
    )
}
