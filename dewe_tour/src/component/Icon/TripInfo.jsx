import style from "./TripInfo.module.css"

export default function TripInfo(props) {

    return (
        <div>
            <small className="font-grey" style={{fontWeight:"800"}}>{props.menu}</small>
            <div className="d-flex">
            <img className={style.IconTrip} src={`/assets/icons/${props.img}`} alt={props.img} />
            <p className="fw-bold">{props.data}</p>
            </div>
        </div>
    )
}
