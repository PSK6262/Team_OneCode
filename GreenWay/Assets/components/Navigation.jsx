
import {Route, Routes} from 'react-router'
import { Button, Spinner, Container, Nav, Navbar, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './Main'
function Navigation(){
    
    
    return(
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                <Navbar.Brand href="#home">GreenWay</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#home">메인화면</Nav.Link>
                    <Nav.Link href="#features">산책로 소개</Nav.Link>
                    <Nav.Link href="#pricing">공원 소개</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Main/>}></Route>
            </Routes>
        </>
    )
}
export default Navigation