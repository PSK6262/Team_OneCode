<<<<<<< HEAD
import { Route, Routes, Link } from "react-router";
import {
  Button,
  Spinner,
  Container,
  Nav,
  Navbar,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import parksData from "../data/parksData.js";
import Logo from "../images/logo.png";
// 1페이지 Main Import
import Main from "./Main";
// 여기 아래에 2페이지 Import 하세요

// 여기 아래에 3페이지 Import 하세요

function Navigation() {
  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">
            <img src={Logo} className="logo" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/" className="Home">
              메인화면
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Main Data={parksData} />}></Route>
      </Routes>
    </>
  );
}
export default Navigation;
=======
import { Route, Routes, Link, useNavigate } from 'react-router'
import { Button, Spinner, Container, Nav, Navbar, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import parksData from '../data/parksData.js'
// 1페이지 Main Import
import Main from './Main'
// 2페이지 import
import Trail from '../page2/Trail.jsx';
function Navigation(){
    const Logo = "/images/logo.png";
    let navigate = useNavigate();
    
    return(
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => { navigate("/") }}>
                        <img src={Logo} className='logo' alt="로고"/>
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => { navigate("/") }} className="Home" style={{ cursor: 'pointer' }}>
                            메인화면
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Main Data={parksData}/>}></Route>
                <Route path="/trail" element={<Trail Data={parksData} />}></Route>
                <Route path="/trail/:id" element={<Trail Data={parksData} isDetail={true}/>}></Route>
            </Routes>
        </>
    )
}
export default Navigation;
>>>>>>> d57737ada14b437a1e3feae757a367f2d4f6b484
