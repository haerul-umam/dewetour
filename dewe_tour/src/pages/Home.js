import Footer from "../component/Footer/Footer"
import Header from "../component/Nav/Header"
import style from "./css/Home.module.css"
import Prime from "../component/Card/Prime"
import Tour from "../component/Card/Tour"

import { useHistory } from "react-router-dom";
import { primeText } from "../data/prime.json"
import { useState, useEffect} from "react"
import { API } from "../config/api"

export default function Home(props) {
    // const {search, setData} = props
    const [text, setText] = useState(null)
    const [trips, setTrips] = useState([])

    const getTrips = async () => {
        try {
            const response = await API.get("/trips")
            setTrips(response.data?.data)
        }catch(e){
            console.log(e)
        }
    }

    const handleChange =(e) =>{
        setText(e.target.value)
      }
    
      let history = useHistory()
      const searching = () =>{
        if (text){
       
          history.push(`/search?q=${text}`)
        }
      }

    useEffect(() => {
        getTrips()
    },[])

    return (
        <>
            <div className={`${style.HeaderImage}`}>
                <div className="container open-sans" style={{color:"#ffff"}}>
                    <Header/>
                    <div className="mt-5">
                        <h1 className="fw-bold">Explore</h1>
                        <h4 style={{fontSize:"3rem", fontWeight:"200"}}>your amazing city together</h4>
                    </div>
                    <div className="mt-5">
                        <p>Find greate places to holiday</p>
                        <div className="d-flex">
                            <input type="text" className={`${style.SearchBarInput} w-100`} onChange={handleChange}/>
                            <button className={`${style.SearchBarButton} btn btn-warning`} onClick={searching}>Search</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container d-flex flex-wrap justify-content-around" style={{marginTop:"-3.125rem"}}>
                {
                    primeText.map(item => {
                        return <Prime item={item} key={item.id} />
                    })
                }
            </div>
            <h1 className="text-center my-5" style={{fontWeight:"800"}}>Group Tour</h1>
            <div className="container" style={{marginBottom:"10rem"}}>
                <div className="d-flex flex-wrap justify-content-evenly">
                {
                    trips.map(tour => {
                        return <Tour tour={tour} key={tour.id}/>
                    })
                }
                </div>
            </div>
            <Footer/>
        </>
    )
}
