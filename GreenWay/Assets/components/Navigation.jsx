import { Route, Routes, Link, useNavigate } from 'react-router'
import { Button, Spinner, Container, Nav, Navbar, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css';
import parksData from '../data/parksData.js'
// 1페이지 Main Import
import Main from './Main'
// 2페이지 import
import Trail from '../page2/Trail.jsx';
// 3페이지 import
import Park from './Park3.jsx'

function Navigation(){
    const Logo = "/images/logo.png";
    let navigate = useNavigate();
    
    return(
        <>
            <Navbar className='navbar_main' data-bs-theme="light">
                <Container>
                    <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => { navigate("/") }}>
                        <img src={Logo} className='logo' alt="로고"/>
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => { navigate("/") }} className="Home" style={{ cursor: 'pointer' }}>
                            공원 · 산책로 안내
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Main Data={parksData}/>}></Route>
                {/* <Route path="/trail" element={<Trail Data={parksData} />}></Route> */}
                <Route path="/trail/:id" element={<Trail Data={parksData} isDetail={true}/>}></Route>
                <Route path="/park/:id" element={<Park Data={parksData}/>}></Route>
            </Routes>
        </>
    )
}
export default Navigation;