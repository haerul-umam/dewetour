import Footer from "../component/Footer/Footer";
import Header from "../component/Nav/Header";
import ProfileInfo from "../component/Icon/ProfileInfo";
import Loading from "../component/Loading/Loading";
import Transaction from "../component/Card/Transaction"

import {NotificationContainer, NotificationManager} from "react-notifications"
import "./css/backgroundNavbar.css";
import style from "./css/Profile.module.css";
import { Container, Image, Button, Modal, Col, Row, Form, FloatingLabel } from "react-bootstrap";

import { useState, useEffect } from "react";
import { API } from "../config/api";

export default function Profile() {
  const [history, setHistory] = useState([])
  const [profile, setProfile] = useState({
    isLoading: true,
    user: {},
  });
  const [preview, setPreview] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [checked, setChecked] = useState({
    male: null,
    female: null,
  });
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });

  const handleCheckbox = (e) => {
    setForm((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  const handleChange = (e) => {
    e.preventDefault();

    try {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
      }));

      if (e.target.type === "file") {
        let url = URL.createObjectURL(e.target.files[0]);
        setPreview(url);
      }
    } catch (e) {
      console.log(e);
      setPreview((prev) => prev);
    }
  };

  const handleChecked = (gender) => {
    if (gender === "male") {
      setChecked((prev) => ({ ...prev, male: true }));
    } else {
      setChecked((prev) => ({ ...prev, female: true }));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData()
      if(form.image) {
          formData.set("image", form.image[0], form.image[0].name)
      }
      formData.set("fullName", form.fullName)
      formData.set("email", form.email)
      formData.set("phone", form.phone)
      formData.set("address", form.address)
      formData.set("gender", form.gender)
      
      const response = await API.put("/user", formData, config);
      if (response.status === 200){
        getProfile()
        NotificationManager.success("Success update data")
      }
      
    } catch (e) {
      console.log(e);
    }
  };

  const getProfile = async () => {
    try {
      const response = await API.get("/profile");
      const history = await API.get("history")

      setForm((prev) => ({
        ...prev,
        ...response?.data.data
      }));

      handleChecked(response?.data.data.gender);
    
      setProfile({ isLoading: false, user: response?.data.data });
      setHistory(history?.data.data)
    } catch (e) {
      console.log(e);
    }
  };

  const handleOff = () => {
    setModalShow(false);
    setPreview(null);
  };

  useEffect(() => {
    getProfile();
    return () => {
      setProfile({ isLoading: true, user: {} });
    };
    //eslint-disable-next-line
  }, []);

  return (
    <>
      {profile.isLoading && <Loading />}
      {!profile.isLoading && (
        <>
          <div className="header-bg">
            <Container>
              <Header />
            </Container>
          </div>
          <Container className="py-5">
            <Container className="w-75 d-flex justify-content-between bg-light p-4 mb-5" style={{ borderRadius: "5px" }}>
              <div>
                <h2 className="fw-bold">Personal Info</h2>
                <div className="d-flex flex-column justify-content-around h-75">
                  <ProfileInfo data={{ img: "name.png", name: profile.user.fullName, info: "Full name" }} />
                  <ProfileInfo data={{ img: "post.png", name: profile.user.email, info: "Email" }} />
                  <ProfileInfo data={{ img: "phone.png", name: profile.user.phone, info: "Phone" }} />
                  <ProfileInfo data={{ img: "place.png", name: profile.user.address, info: "Address" }} />
                </div>
              </div>
              <div>
                {profile.user.image === null ? <Image src="/assets/icons/noavatar.png" className={style.ImageProfile} /> : <Image src={profile.user.image} className={style.ImageProfile} />}

                <Button variant="warning" className="text-light fw-bold d-block mt-2 w-100" onClick={() => setModalShow(true)}>
                  Change Profile
                </Button>

                <Modal show={modalShow} onHide={handleOff} centered size="lg">
                  <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title>
                      <p>Edit Profile</p>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Container>
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col md>
                            <Row className="g-2 mb-2">
                              <Col md>
                                <FloatingLabel label="Full Name">
                                  <Form.Control type="text" name="fullName" onChange={handleChange} defaultValue={profile.user.fullName} />
                                </FloatingLabel>
                              </Col>
                              <Col md>
                                <FloatingLabel label="Email">
                                  <Form.Control type="email" name="email" onChange={handleChange} defaultValue={profile.user.email} />
                                </FloatingLabel>
                              </Col>
                            </Row>
                            <Row className="g-2 mb-2">
                              <Col md>
                                <FloatingLabel label="Phone">
                                  <Form.Control type="text" name="phone" onChange={handleChange} defaultValue={profile.user.phone} />
                                </FloatingLabel>
                              </Col>
                              <Col md>
                                <small className="d-block" style={{ color: "#8f9193" }}>
                                  Gender
                                </small>
                                <Form.Check inline label="Male" name="gender" defaultValue="male" type="radio" checked={checked.male} onChange={handleCheckbox} />
                                <Form.Check inline label="Female" name="gender" defaultValue="female" type="radio" checked={checked.female} onChange={handleCheckbox} />
                              </Col>
                            </Row>
                            <Row>
                              <Col md className="mb-2">
                                <FloatingLabel label="Address">
                                  <Form.Control type="text" name="address" onChange={handleChange} defaultValue={profile.user.address} />
                                </FloatingLabel>
                              </Col>
                            </Row>
                          </Col>
                          <Col md={4}>
                            <div className="d-flex align-items-center justify-content-center flex-column">
                              <Button
                                variant="link"
                                size="sm"
                                className="text-primary fw-bold text-decoration-none"
                                onClick={() => {
                                  document.getElementById("image").click();
                                }}
                                >
                                select image
                              </Button>
                                {preview && <Image src={preview} style={{ maxHeight: "13.4rem", maxWidth: "100%" }} />}
                            </div>
                            <input type="file" id="image" name="image" accept="image/*" className="d-none" onChange={handleChange}></input>
                          </Col>
                        </Row>
                    <Button type="submit">Save</Button>
                      </Form>
                    </Container>
                  </Modal.Body>
                </Modal>
              </div>
            </Container>
            <h2 className="fw-bold mb-4">History Trip</h2>
            {history.map(pay => {
                return <div key={pay.id} className="mb-4">
                <Transaction data={{transact: pay, showButton: false, forUser: "user"}} />
                </div>
            })}
          </Container>
          <NotificationContainer/>
          <Footer />
        </>
      )}
    </>
  );
}
