
import {Route, Routes, Link, useNavigate} from 'react-router'
import { Button, Spinner, Container, Nav, Navbar, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import parksData from '../data/parksData.js'
import Logo from '../images/logo.png'
import Main from './Main'
import Page2 from '../page2/page2';

function Navigation(){
    
    let navigate =  useNavigate();
    
    return(
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                <Navbar.Brand href="/"><img src={Logo} className='logo'/></Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#home">메인화면</Nav.Link>
                    <Nav.Link onClick={()=>{navigate("introWalk")}}>산책로 소개</Nav.Link>
                    <Nav.Link href="#pricing">공원 소개</Nav.Link>
                    <Nav.Link href="/">메인화면으로 돌아가기</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Main/>}></Route>
                <Route path="/introWalk" element={<Page2 />}></Route>
                <Route path="/" element={<Main Data={parksData}/>}></Route>
            </Routes>
        </>
    )
}
export default Navigation