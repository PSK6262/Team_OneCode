import { useParams } from 'react-router'
import { Container, Row, Col, Card } from 'react-bootstrap';
import { MapPin, Sparkles, Ruler, ParkingCircle, Clock } from "lucide-react";
import './Trail.css';
import parksData from '../data/parksData.js';
import { motion } from 'framer-motion';

function Trail({ Data,index }) {
    let { id } = useParams();

    let trail = Data.find((item) => {
        return item.id == id;
    })

    let trailIndex = Data.findIndex((item) => {
        return item.id == id;
    })
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}     /* 시작 상태: 투명도 0, 아래로 20px 떨어짐 */
            animate={{ opacity: 1, y: 0 }}      /* 완료 상태: 투명도 1, 원래 위치 */
            exit={{ opacity: 0, y: -20 }}       /* 사라질 때 상태 (선택) */
            transition={{ duration: 1.0, ease: "easeOut" }} /* 0.5초 동안 부드럽게 */
        >
            <Container>
                <Row>
                    <h1>{trail.name}</h1>
                    <Col md={4}>
                        <img src={trail.image} style={{ width: '600px', height: '600px', backgroundSize: 'cover', marginTop:'50px' }} />
                    </Col>
                    <Card style={{ width: '23rem', marginLeft: 'auto' }}>
                        <Card.Body>
                            <div className="inner-box">
                                <MapPin size={18} color='red'/>
                                <h5>주소</h5>
                                <Card.Text>{trail.address}</Card.Text>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="inner-box">
                                <Sparkles size={18} color='yellowgreen'/>
                                <h5>특징</h5>
                                <Card.Text>{trail.description}</Card.Text>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="inner-box">
                                <Ruler size={18}/>
                                <h5>산책로 길이</h5>
                                <Card.Text>{trail.distance}m</Card.Text>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="inner-box">
                                <ParkingCircle size={18} color='blue'/>
                                <h5>편의 시설</h5>
                                <Card.Text>{trail.convenience}</Card.Text>
                            </div>
                        </Card.Body>
                        <Card.Body>
                        <div className="inner-box">
                            <Clock size={18}/>
                                <h5>산책 시간</h5>
                                <Card.Text>{trail.time}분</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </motion.div>
    )
}

export default Trail;
