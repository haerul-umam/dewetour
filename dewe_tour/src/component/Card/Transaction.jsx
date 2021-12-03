import { Container, Row, Col, Image, Button } from "react-bootstrap"
import TableTransaction from "../Table/TableTransaction"
import style from "./Transaction.module.css"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../context/authContext"
import { API } from "../../config/api"
import { io } from "socket.io-client"

import {NotificationContainer, NotificationManager} from 'react-notifications';

let socket
export default function Transaction({data}) {
    const transact = data.transact
    const [preview, setPreview] = useState(null)
    const [imgProof, setImgProof] = useState(null)
    const [stateUser,] = useContext(AuthContext)
  
    const handleChange = (e) => {
        
        try{
            if (e.target.type === "file") {
                setImgProof(e.target.files)
                let url = URL.createObjectURL(e.target.files[0])
                setPreview(url)}
        }catch{
            setPreview(prev => prev)
        }
    }
    
    // function only for user update transaction and upload proof
    const uploadAndUpdate = async (status) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
    
            const formData = new FormData()
            formData.set("status",status)
            formData.set("image",imgProof[0], imgProof[0].name)

            const response = await API.put("/transaction/" + transact.id + "/status", formData, config)

            if (response.status === 200){
                NotificationManager.success("Your payment will be confirmed within 24 hours")
                data.dispatch()

                socket.emit("send proof", transact.id)
            }
        }catch(e) {
          console.log(e)
          if (e.response === undefined){
              NotificationManager.warning("Please upload proof transaction")
          }else{
              NotificationManager.warning(`${e.response?.data.message}`)
          }
        }
    }

    const updateTransact = async (status) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
    
            const formData = new FormData()
            formData.set("status",status)

            const response = await API.put("/transaction/" + transact.id + "/status", formData, config)
            
            if (response.status === 200){
                NotificationManager.success(response.data.message,"",1000)
                socket.emit("update payment", response.data.data)
                socket.emit("update status mark as read", transact.id)
                data.setModal(false)
                data.dispatch()
            }


        }catch(e) {
          console.log(e)
          NotificationManager.warning(`${e.response?.data.message}`)
        }
    }
  
    const showActionButton = (status = transact.status) =>{
        if (data.forUser === "user" && status === "Waiting Payment"){
            return <Button variant="warning" className="fw-bold text-light" style={{width:"7rem"}}onClick={()=> {uploadAndUpdate("Waiting Approve")}}>PAY</Button>
        }

        if (data.forUser === "admin"){
            switch(status){
                case "Waiting Approve":
                case "Pending":
                    return (
                    <> 
                    <Button variant="danger" className="fw-bold text-light me-2" style={{width:"7rem"}} onClick={() => {updateTransact("Cancel")}}>Cancel</Button>
                    <Button variant="success" className="fw-bold text-light" style={{width:"7rem"}}onClick={() => {updateTransact("Approved")}}>Approve</Button>
                    </>)
                default:
                    return <></>       
            }
        }
    }

    const badgeColor = (status) =>{
        switch(status){
            case "Waiting Payment":
                return style.Danger
            case "Waiting Approve":
                return style.Warning
            case "Approved":
                return style.Success
            default:
                return style.Danger
        }
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
        //eslint-disable-next-line
    },[])
    return (
        <Container className="bg-light p-3" style={{borderRadius:"5px"}}>
            <Row>
                <Col>
                    <Image src="/assets/images/logo.png" alt="logo"/>
                </Col>
                <Col>
                    <h2 className="fw-bold text-end">Booking</h2>
                    <p className="fw-bold text-end">{transact.orderDate}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4 className="fw-bold">{transact.trip.title}</h4>
                    <p className="font-grey">{transact.trip.country.name}</p>
                    <span className={badgeColor(transact.status)}>{transact.status}</span>
                </Col>
                <Col>
                    <Row className="row-cols-2">
                        <Col>
                            <p className="fw-bold m-0">Date Trip</p>
                            <p className="font-grey">{transact.trip.dateTrip}</p>
                        </Col>
                        <Col>
                            <p className="fw-bold m-0">Accommodation</p>
                            <p className="font-grey">{transact.trip.accommodation}</p>
                        </Col>
                        <Col>
                            <p className="fw-bold m-0">Duration</p>
                            <p className="font-grey">{transact.trip.day} Days {transact.trip.night} Nights</p>
                        </Col>
                        <Col>
                            <p className="fw-bold m-0">Date Trip</p>
                            <p className="font-grey">{transact.trip.dateTrip}</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm={2} className="d-flex justify-content-center flex-column">
                    {!transact.attachment ? 
                    <>
                    {preview && 
                    <Image className={style.ImageProof} src={preview}/>
                    }
                    {data.forUser === "user" &&
                    <Button size="sm" onClick={()=>(document.getElementById(transact.id).click())}>Select file</Button>
                    }
                    <input type="file" id={transact.id} className="d-none" accept="image/*" onChange={handleChange}/>
                    </> 
                    : 
                    <Image className={style.ImageProof} src={`${transact.proof}`}/>
                    }
                    <figcaption className="text-center font-grey" style={{fontSize:"14px"}}>upload payment proof</figcaption>
                </Col>
            </Row>
            <TableTransaction data={transact}/>
            <div className="text-end">
                {data.showButton && showActionButton()}
            </div>
        <NotificationContainer/>
        </Container>
    )
}
