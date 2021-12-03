import style from "./Search.module.css"
import { useState } from "react";
import { useHistory } from "react-router-dom";
import SearchTrip from "../../pages/SearchTrip";


export default function Search(props) {
  const {trips} = props
  const [search, setSearch] = useState(null)
  const [result, setResult] = useState([])

  const handleChange =(e) =>{
    const pattern = new RegExp(e.target.value)
    setSearch(pattern)
  }

  let history = useHistory()
  const searching = () =>{
    if (search){
      const filter = trips.filter((trip) => {
          return search.test(trip.title.toLowerCase())
      })
      
      history.push("/search")
    }
  }

  return (
    <>
      <div className="d-flex">
        <input type="text" className={`${style.SearchBarInput} w-100`} onChange={handleChange}/>
        <button className={`${style.SearchBarButton} btn btn-warning`} onClick={searching}>Search</button>
      </div>
    </>
  );
}
