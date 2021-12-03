import { Card } from "react-bootstrap"
import style from "./Prime.module.css"

export default function Prime({item}) {
    return (
        <Card className={style.Card}>
            <i style={{color:"#FFAF00"}} className={`text-center card-icon ${item.icon}`}></i>
            <Card.Body className="text-center mt-4">
                <Card.Title className="fw-bold">{item.title}</Card.Title>
                <Card.Text>{item.about}</Card.Text>
            </Card.Body>
        </Card>
    )
}
