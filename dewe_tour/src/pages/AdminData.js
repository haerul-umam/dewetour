import Footer from "../component/Footer/Footer"
import Header from "../component/Nav/Header"
import Tour from "../component/Card/Tour"

import "./css/backgroundNavbar.css"
import { Container } from "react-bootstrap"
import "./css/Admin.css"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { API } from "../config/api"


export default function AdminData() {
    const [trips, setTrips] = useState([])
    const [countries, setCountries] = useState([])



    const getData = async ()=> {
        try{
            const dataTrip = await API.get("/admin-trips")
            setTrips(dataTrip?.data.data)

            const dataCountries = await API.get("/countries")
            setCountries(dataCountries?.data.data)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() =>{
        getData()
    },[])

    return (
        <>
            <div className="header-bg">
            <Container>
                <Header/>
            </Container>
            </div>
            <Container className="py-5">
            
            <div className="mytabs">

                <input type="radio" id="tabtrip" name="mytabs" checked readOnly/>
                <label htmlFor="tabtrip" ><i className="fas fa-suitcase"></i>Trip</label>
                <div className="tab">
                    <div className="text-end">
                        <button className="btn btn-warning">
                        <Link to="/add-trip" className="text-decoration-none fw-bold text-light">Add Trip</Link>
                        </button>
                    </div>
                    <div className="my-4 d-flex flex-wrap justify-content-evenly">
                    {
                    trips.map(tour => {
                        return <Tour tour={tour} key={tour.id}/>
                    })
                    }
                    </div>
                </div>

                <input type="radio" id="tabcountry" name="mytabs"/>
                <label htmlFor="tabcountry" ><i className="fas fa-globe-americas"></i>Country</label>
                <div className="tab">
                    <div className="text-end">
                        <button className="btn btn-warning">
                        <Link to="/add-country" className="text-decoration-none fw-bold text-light">Add Country</Link>
                        </button>
                    </div>
                    <div>
                        <table className="table align-middle">
                            <thead style={{borderBottom:"2px solid rgba(183, 183, 183, 0.5)"}}>
                                <tr>
                                <th>No</th>
                                <th>Country</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody >
                              
                                {countries.map((country,i) => (
                                    <tr key={country.id}>
                                        <td>{i+1}</td>
                                        <td >{country.name}</td>
                                        <td>
                                            <Link to={`/edit-country/${country.id}`}>
                                            <button className="btn"><i className="fas fa-pen-square fa-lg"></i></button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                               
                            </tbody>
                        </table>
                    </div>
                </div>
            
            </div>
               
            </Container>
            <Footer/>
        </>
    )
}
