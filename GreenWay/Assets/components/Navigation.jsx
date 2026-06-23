import { Route, Routes, Link, useNavigate } from 'react-router'
import { Button, Spinner, Container, Nav, Navbar, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import parksData from '../data/parksData.js'
import Logo from '../images/logo.png'
// 1페이지 Main Import
import Main from './Main'
// 2페이지 import
import Trail from '../page2/Trail.jsx';


import IMG from '../images/id1.png'
function Navigation(){
    
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