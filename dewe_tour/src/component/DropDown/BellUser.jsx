import { Dropdown } from "react-bootstrap";
import "./DropDown.css"

import React, { useEffect, useContext, useState } from "react";
import {AuthContext} from "../../context/authContext"
import {io} from "socket.io-client"


let socket
export default function Bell() {
    const [stateUser,] = useContext(AuthContext)
    const [update, setUpdate] = useState([])   //update payment notif for user
    
    const loadUpdatePayment = () => {
        socket.emit("load update")
        socket.on("get data update",(data) => {
            setUpdate(data)
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
            console.log(err.message)
        })

        loadUpdatePayment()
        
        socket.on("get update status", () => {
            socket.emit("load update")
        })

        socket.on("get update read", () => {
            socket.emit("load update")
        })

        return () => {
            socket.disconnect()
        }
        //eslint-disable-next-line
    },[])


    const markAsRead = () => {
        let arrayId = update.map(val => val.id)
        arrayId.forEach(id => (socket.emit("update read", id, stateUser.user.email)))
    }

    return (
        <Dropdown className="me-4" >
            <Dropdown.Toggle variant="light" style={{height:"50px"}} id="dropdown-basic">
                {
                    update.length > 0 ? 
                    <i className="fas fa-comment-dollar">
                    <div className="dot"></div>
                    </i>
                    :
                    <i className="fas fa-comment-dollar"></i>
                }
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
                <div className="notif-wrapper">
                {update && 
                    update.map(val => (
                        <React.Fragment key={val.id}>
                        <div className="d-flex flex-column notif-card">
                            <small className="fs-10">Payment : {val.transaction.status}</small>
                            <small className="fs-12">{val.transactionDate}</small>
                            <small className="fw-bold fs-12 title-trip">{val.transaction.triptitle}</small>
                            <small className="fw-bold fs-12">{val.transaction.total}</small>
                        </div>
                        <hr className="my-1"/>
                        </React.Fragment>
                    ))
                }
                </div>
                {
                    update.length > 0 ? 
                    <p className="m-0 fs-12 text-primary text-center mark-text" onClick={markAsRead}>Mark all as read</p>
                    :
                    <p className="m-0 fs-12 text-primary text-center">No updated payment</p>
                }   
            </Dropdown.Menu>
        </Dropdown>
    )
}
