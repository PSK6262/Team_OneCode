import { Route, Routes, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Spinner, Container, Nav, Navbar, Row, Col, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navigation.css";
import parksData from "../data/parksData.js";
// 1페이지 Main Import
import Main from "./Main";
// 2페이지 import
import Trail from "../page2/Trail.jsx";
// 3페이지 import
import Park from "./Park3.jsx";
import WeatherWidget from "./WeatherWidget.jsx";

function Navigation() {
  const Logo = "/images/logo.png";
  let navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true); // 제일 처음 화면 보이기, 이후 false
  
  //천안의 위치. 나중에 범위가 커지면 바꿀 것.
  const lat = 36.8041;
  const lng = 127.1525;
  return (
    <>
      <Navbar className="navbar_main" data-bs-theme="light">
        <Container className="navbar_container">
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}>
            <img src={Logo} className="logo" alt="로고" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link
              id="navlink"
              className="Home"
              onClick={() => {
                setShowIntro(false);
                navigate("/");
              }}
              style={{ cursor: "pointer" }}>
              공원 · 산책로 확인
            </Nav.Link>
            <Nav.Link
              id="navlink"
              className="random-select"
              onClick={() => {
                const length = parksData.length;
                const selectedNumber = Math.floor(Math.random()*length);
                setShowIntro(false);
                parksData[selectedNumber].type === "공원" ? 
                navigate("/park/"+(selectedNumber+1)) : navigate("/trail/"+(selectedNumber+1));
              }}
              style={{ cursor: "pointer" }}>
              추천 산책로
            </Nav.Link>
            <div className="weather-wrapper">
              <WeatherWidget lat={lat} lng={lng}/>
            </div>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route
          path="/"
          element={
            <Main
              Data={parksData}
              showIntro={showIntro}
              setShowIntro={setShowIntro}
            />
          }></Route>
        <Route
          path="/trail/:id"
          element={
            <Trail Data={parksData} isDetail={true} />
          }></Route>
        <Route
          path="/park/:id"
          element={<Park Data={parksData}/>}></Route>
      </Routes>
    </>
  );
}
export default Navigation;
