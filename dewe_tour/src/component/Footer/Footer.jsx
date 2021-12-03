import style from "./Footer.module.css"

const Footer = () =>{
    return (
        <footer className="bg-warning d-flex justify-content-center align-items-center py-3 mt-auto position-relative open-sans">
            <p style={{margin:"0"}}>Copyright &copy; 2021 Dewe Tour - Haerul Umam. All Right reserved</p>
            <img className={style.footerImg} src="/assets/images/leaf.png" alt="leaf" />
        </footer>
    )
}

export default Footer