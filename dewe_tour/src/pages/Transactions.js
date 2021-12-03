import Footer from "../component/Footer/Footer"
import Header from "../component/Nav/Header"
import Transaction from "../component/Card/Transaction"

import "./css/backgroundNavbar.css"
import { Container, Table, Modal } from "react-bootstrap"

import { useState, useEffect } from "react"
import { API } from "../config/api"

export default function Transactions() {
    const [transact, setTransact] = useState([])
    const [modal, setModal] = useState(false)
    const [order, setOrder] = useState({})

    const badgeColor = (status) =>{
        switch(status){
            case "Waiting Payment":
                return "text-danger"
            case "Waiting Approve":
                return "text-warning"
            case "Approved":
                return "text-success"
            default:
                return "text-danger"
        }
    }

    const getTransaction = async ()=> {
        try{
            const response = await API.get("/orders")
            setTransact(response?.data.data)
        }catch(e){
            console.log(e)
        }
    }

    const actionModal =(show, data) => {
        setModal(show)
        setOrder(data)
    }   
    useEffect(() =>{
        getTransaction()
    },[])

    return (
        <>
            <div className="header-bg">
            <Container>
                <Header/>
            </Container>
            </div>
            <Container className="mt-5">
                <h2>Incoming Transactions</h2>
                <div className="bg-light p-2">
                    <Table striped hover responsive className="align-middle">
                        <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Users</th>
                            <th scope="col">Trip</th>
                            <th scope="col">Proof</th>
                            <th scope="col">Status Payment</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                transact.map((order,index) => {
                                    return <tr key={order.id}>
                                    <td>{index + 1}</td>
                                    <td>{order.customer.fullName}</td>
                                    <td>{order.trip.title}</td>
                                    <td><a href={order.proof} target="_blank" rel="noopener noreferrer">payment</a></td>
                                    <td className={badgeColor(order.status)}>{order.status}</td>
                                    <td>
                                    <button className="btn" onClick={()=>{
                                        actionModal(true, order)
                                        }}>
                                        <img src="/assets/icons/action.png" alt="action" />
                                    </button>
                                    </td>
                                    </tr>
                                })
                            }
                        </tbody>
                        <Modal show={modal} onHide={() => {setModal(false)}} size="lg" centered>
                            <Transaction data={{transact: order, showButton: true, forUser: "admin", dispatch:getTransaction, setModal}} />
                        </Modal>
                    </Table>
                </div>
            </Container>
            <Footer/>
        </>
    )
}
