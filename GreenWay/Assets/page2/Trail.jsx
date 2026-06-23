import { useParams } from 'react-router'
import { Container, Row, Col } from 'react-bootstrap';
import { MapPin, Sparkles, Ruler, ParkingCircle, Clock, Map } from "lucide-react";
import './Trail.css';
import parksData from '../data/parksData.js';
import { motion } from 'framer-motion';

function Trail({ Data, index }) {
    let { id } = useParams();
    let trail = Data.find((item) => item.id == id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >

            <Container className="trail-page-container" style={{ padding: '0 20px' }}>
                
                <div className="trail-title-box">
                    <h1 className="m-0 fw-bold" style={{ color: '#1a3a2a', textAlign: 'left', paddingLeft: '20px' }}>
                        {trail.name}
                    </h1>
                </div>

                <Row className="align-items-start mx-0" style={{ marginBottom: '40px' }}>
                    <Col md={5} className="mb-4 mb-md-0 text-center">
                        <img 
                            src={trail.image} 
                            alt={trail.name} 
                            style={{ 
                                width: '100%', 
                                maxWidth: '500px',
                                height: '475px', 
                                aspectRatio: '1/1',
                                objectFit: 'cover', 
                                borderRadius: '24px', 
                                boxShadow: '0 12px 36px rgba(0,0,0,0.1)'
                            }} 
                        />
                    </Col>

                    <Col md={7} lg={6} className="ms-auto">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            
                            {[
                                { icon: <MapPin size={20} color='orange' />, title: '주소', text: trail.address },
                                { icon: <Sparkles size={20} color='yellowgreen' />, title: '특징', text: trail.description },
                                { icon: <Ruler size={20} color='#4A5D4E' />, title: '산책로 길이', text: `${trail.distance}m` },
                                { icon: <ParkingCircle size={20} color='blue' />, title: '편의 시설', text: trail.convenience },
                                { icon: <Clock size={20} color='green' />, title: '산책 시간', text: `${trail.time}분` }
                            ].map((item, idx) => (
                                <div key={idx} className="glass-info-item">
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                        flexShrink: 0
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'left' }}>
                                        <h6 style={{ margin: '0 0 2px 0', fontWeight: '700', color: '#1a3a2a' }}>{item.title}</h6>
                                        <p style={{ margin: 0, color: '#333', fontSize: '14px', lineHeight: '1.5', fontWeight: '500' }}>{item.text}</p>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </Col>
                </Row>
            </Container>

            <div className="trail-bottom-footer-bg"></div>
        </motion.div>
    );
}

export default Trail;