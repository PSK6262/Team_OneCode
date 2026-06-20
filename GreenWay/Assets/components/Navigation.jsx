import {Route, Routes , Link} from 'react-router'
import { Button, Spinner, Container, Nav, Navbar, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import parksData from '../data/parksData.js'
import Logo from '../images/logo.png'
// 1페이지 Main Import
import Main from './Main'
// 여기 아래에 2페이지 Import 하세요

// 여기 아래에 3페이지 Import 하세요

function Navigation(){
    
    return(
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                <Navbar.Brand href="/"><img src={Logo} className='logo'/></Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/" className="Home">메인화면</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Main Data={parksData}/>}></Route>
            </Routes>
        </>
    )
}
export default Navigation