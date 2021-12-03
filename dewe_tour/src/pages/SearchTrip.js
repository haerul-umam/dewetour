import Footer from "../component/Footer/Footer";
import Header from "../component/Nav/Header";
import Tour from "../component/Card/Tour"

import "./css/backgroundNavbar.css";
import { Container } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { API } from "../config/api"


function useQuery() {
  const {search} = useLocation()

  return useMemo(() => new URLSearchParams(search),[search])
}

export default function SearchTrip() {
  let query = useQuery()
  const [trips, setTrips] = useState([])

  const getSearch = async () => {
    try{
      const q = query.get("q")
      const response = await API.get("/search?q="+q)
      setTrips(response.data?.data)
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => { 
    getSearch()
    //eslint-disable-next-line
  }, [])

  return (
    <>
      <div className="header-bg">
        <Container>
          <Header />
        </Container>
      </div>
      <Container className="my-5">
        <div className="d-flex flex-wrap justify-content-evenly">
          {trips.map((tour) => {
            return <Tour tour={tour} key={tour.id} />;
          })}
        </div>
      </Container>
      <Footer />
    </>
  );
}
