import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import style from "./Tour.module.css"

export default function Prime({tour}) {
    
    return (
        <Card className={style.Card}>
            <Link to={`/trip/${tour.id}`}>
                <Card.Img variant="top" src={tour['image'][0]} alt={tour.country.name} className={style.Img} />
            </Link>
            <p className={style.Quota} style={{fontWeight:"800"}}>{`${tour.quota_filled}/${tour.quota}`}</p>
            <Card.Body style={{padding:"1rem 0"}}>
                <Card.Title className={`${style.Title} h5`}>{tour.title}</Card.Title>
                <div className="d-flex justify-content-between">
                    <Card.Text className="text-warning" style={{fontSize:"18px",fontWeight:"900"}}>Rp. {tour.price.toLocaleString("id-ID")}</Card.Text>
                    <Card.Text className="font-grey" style={{fontSize:"18px", fontWeight:"800"}}>{tour.country.name}</Card.Text>
                </div>
            </Card.Body>
        </Card>
    )
}
