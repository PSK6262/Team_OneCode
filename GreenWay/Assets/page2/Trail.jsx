import { href, useParams } from 'react-router'
import { Container, Row, Col } from 'react-bootstrap';
import { MapPin, Sparkles, Ruler, ParkingCircle, Clock } from "lucide-react";
import './Trail.css';
import parksData from '../data/parksData.js';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function Trail() {
    const { id } = useParams();
    const [ data, setData ] = useState(null);
    const [ vusdml, setVusdml ] = useState(false);
    const [ showWebsite, setShowWebsite ] = useState(false);

    useEffect(() => {
        const trail = parksData.find((item) => item.id == id);

        if (trail && trail.type == "산책로") {
            setData(trail);
        } else {
            setData(null);
        }
    }, [ id ]);

    const renderConvenience = (convenienceData) => {
        if (!convenienceData) return "없음";

        let finalArray = [];
        if (Array.isArray(convenienceData)) {
            finalArray = convenienceData;
        } else if (typeof convenienceData === 'string') {
            finalArray = convenienceData.split(/[,\/]/);
        }

        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {finalArray.map((facility, fIdx) => {
                    const trimmed = facility.trim();
                    if (!trimmed) return null;
                    return (
                        <span
                            key={fIdx}
                            style={{
                                background: 'rgba(0, 136, 255, 0.08)',
                                color: '#0066cc',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '12.5px',
                                fontWeight: '600',
                                border: '1px solid rgba(0, 136, 255, 0.15)',
                                display: 'inline-block'
                            }}
                        >
                            {trimmed}
                        </span>
                    );
                })}
            </div>
        );
    };

    if (!data) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h3 style={{ fontSize: "24px" }}> 산책로를 찾을 수 없습니다 !</h3>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f4f6f8', padding: '40px 0' }}
        >
            <div className="t-container">
                <div className="t-detail-header">
                    <div className="t-name">
                        <h2>{data.name}</h2>
                        <span className="tag">{data.type}</span>
                    </div>
                    <div className="t-address" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <MapPin size={20} color='orange' />
                        <span>{data.address}</span>
                    </div>
                </div>

                <div className="t-main">
                    <div className="img">
                        <img src={data.image} alt={data.name} />
                    </div>

                    <div className="box">
                        <div className="description">
                            <h5> 소개 </h5>
                            <p>{data.description}</p>
                        </div>

                        <div className="dnlcl" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Ruler size={18} color='#4A5D4E' />
                                <span><strong>산책로 길이:</strong> {data.distance}m</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ParkingCircle size={18} color='blue' />
                                    <strong>편의 시설</strong>
                                </div>
                                <div style={{ paddingLeft: '26px', width: '100%' }}>
                                    {renderConvenience(data.convenience)}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={18} color='green' />
                                <span><strong>산책 시간:</strong> {data.time}분</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="nav-button" onClick={() => {
                        if (data && data.nav) {
                            setShowWebsite(!showWebsite)
                        } else {
                            alert("등록된 사이트 링크가 없습니다!");
                        }
                    }}
                    >내비게이션 보기</button>

                    {showWebsite && data.nav && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '40px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                        >
                            <div style={{ background: '#e8f5e9', padding: '10px 20px', textAlign: 'left', fontWeight: '600', color: '#2e7d32', fontSize: '14px', borderBottom: '1px solid #dcfce7' }}>
                                {data.name}
                            </div>
                            <iframe
                                src={data.nav}
                                title={`${data.name} 웹사이트`}
                                style={{ width: '100%', height: '600px', border: 'none', backgroundColor: '#white' }}
                            />
                        </motion.div>
                    )}
            </div>
        </motion.div>
    );
}

export default Trail;