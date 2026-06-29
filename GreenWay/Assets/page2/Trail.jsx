import { useParams } from 'react-router'
import { MapPin, Ruler, ParkingCircle, Clock, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react";
import './Trail.css';
import parksData from '../data/parksData.js';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

function Trail() {
    const { id } = useParams();
    const [ data, setData ] = useState(null);
    const [ showWebsite, setShowWebsite ] = useState(false);
    const [ showNotice, setShowNotice ] = useState(false);
    let [ upCount, setUpCount ] = useState(() => {
        const saveUpCount = localStorage.getItem(`trail_up_${id}`)
        return saveUpCount ? parseInt(saveUpCount, 10) : 0;
    });
    let [ downCount, setDownCount ] = useState(() => {
        const saveDownCount = localStorage.getItem(`trail_down_${id}`)
        return saveDownCount ? parseInt(saveDownCount, 10) : 0;
    });
    const [ comments, setComments ] = useState([]);
    const [ inputText, setInputText ] = useState("");

    const [ cLat, setCLat ] = useState(null);
    const [ cLng, setCLng ] = useState(null);
    const [ navUrl, setNavUrl ] = useState("");
    const navRef = useRef(null);
    useEffect(() => {
        const trail = parksData.find((item) => item.id == id);

        if (trail && trail.type == "산책로") {
            setData(trail);
            const saveComments = localStorage.getItem(`trail_comment_${id}`)
            setComments(saveComments ? JSON.parse(saveComments) : [])
            const saveUpCount = localStorage.getItem(`trail_up_${id}`)
            setUpCount(saveUpCount ? parseInt(saveUpCount, 10) : 0)
            const saveDownCount = localStorage.getItem(`trail_down_${id}`)
            setDownCount(saveDownCount ? parseInt(saveDownCount, 10) : 0)
        } else {
            setData(null);
        }
    }, [ id ]);

    useEffect(() => {
        if (id) {
            localStorage.setItem(`trail_up_${id}`, upCount.toString())
        }
    }, [ upCount, id ])

    useEffect(() => {
        if (id) {
            localStorage.setItem(`trail_down_${id}`, downCount.toString())
        }
    }, [ downCount, id ])

    useEffect(() => {
        if (id && data) {
            localStorage.setItem(`trail_comment_${id}`, JSON.stringify(comments));
        }
    }, [ comments, id, data ]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCLat(position.coords.latitude);
                    setCLng(position.coords.longitude);
                },
                (error) => console.error("❌ GPS 불통:", error)
            )
        }
    }, [])

    useEffect(() => {
        if (data && data.nav) {
            if (cLat && cLng) {
                const patchedUrl = data.nav.replace('/-/', `/${cLng},${cLat}/`);
                setNavUrl(patchedUrl);
            } else {
                setNavUrl(data.nav)
            }
        }
    }, [ data, cLat, cLng ])

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

    const addComments = () => {
        if (!inputText.trim()) {
            alert("댓글을 입력해주세요!!!")
            return;
        };

        const newComments = {
            id: Date.now(),
            text: inputText
        };

        const updateCommnets = [ ...comments, newComments ];
        setComments(updateCommnets);
        localStorage.setItem(`trail_comment_${id}`, JSON.stringify(updateComments))
        setInputText("");
    }

    const shareLink = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                alert('링크가 복사되었습니다!')
            })
            .catch(() => {
                alert('링크 복사에 실패하였습니다! 다시 시도해주세요!')
            })
    }


    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f4f6f8', padding: '10px 0' }}
        >
            <div className="t-container">
                <div className="t-detail-header">
                    <div className="t-name">
                        <h3>{data.name}</h3>
                        <span className="tag">{data.type}</span>
                    </div>
                    <div className="t-address" style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                        <MapPin size={20} color='orange' />
                        <span>{data.address}</span>
                    </div>
                </div>

                <div className="t-main">


                    <div className="left-column">

                        <div className="img">
                            <img src={data.image} alt={data.name} />
                        </div>

                        <div className="vote-bar">
                            <span style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>
                                😆 이 산책로, 어떠셨나요?
                            </span>

                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: '50px', marginTop: '10px' }}>
                                <button
                                    onClick={() => setUpCount(upCount + 1)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer' }}
                                >
                                    <ThumbsUp size={18} color='#16a34a' fill='#16a34a' />
                                    <strong style={{ color: '#16a34a', fontSize: '13px' }}>{upCount}</strong>
                                </button>
                                <button
                                    onClick={() => setDownCount(downCount + 1)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', border: '1px solid #fecaca', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer' }}
                                >
                                    <ThumbsDown size={18} color='#dc2626' fill='#dc2626' />
                                    <strong style={{ color: '#dc2626', fontSize: '13px' }}>{downCount}</strong>
                                </button>
                                <button className="share-btn" onClick={shareLink}
                                    style={{ backgroundColor: '#f1f5f9', border: 'none', marginLeft: '25px', borderRadius: '12px', width: '200px' }}>
                                    🖨️ 공유하기
                                </button>
                            </div>
                            <button
                                className="music-button"
                                onClick={() => {
                                    window.open("https://www.youtube.com/watch?v=7E74fH0Xoew&list=PLci6UGec4X3g");
                                }}
                            >
                                ▶ 추천 플레이리스트(유튜브)
                            </button>
                        </div>
                        <div style={{ textAlign: 'center', cursor: 'pointer', marginBottom: '8px' }} onClick={() => {
                            setShowNotice(!showNotice)
                        }}><AlertTriangle size={14} />주의 사항<AlertTriangle size={14} />
                            <span>{showNotice ? '▲' : '▼'}</span>
                        </div>
                        {showNotice && (
                            <div style={{
                                textAlign: 'left',
                                padding: '10px',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <ol>
                                    <li>보행 중 스마트폰을 보면 시야각이 좁아져 주변 위험 상황(자전거, 장애물 등)을 감지하기 어려우며, 아름다운 자연환경을 느낄 수 없습니다!</li>
                                    <li>주변 소리(자동차 경적, 자전거 벨 소리 등)를 들을 수 있도록 이어폰 볼륨을 낮추거나 한쪽 귀를 열어두세요.</li>
                                    <li>산책로나 보도에서는 우측통행을 기본으로 하여 마주 오는 사람과의 충돌을 방지합니다.</li>
                                    <li>어두운 시간대에는 운전자나 자전거 운전자가 쉽게 식별할 수 있도록 밝은색 옷을 입거나 야광 밴드, 휴대용 플래시를 지참하세요.</li>
                                    <li>산책 전후로 가벼운 스트레칭을 통해 관절과 근육을 풀어주어 부상을 예방합니다.</li>
                                    <li>발을 안정적으로 잡아주고 충격을 흡수할 수 있는 운동화나 워킹화를 착용하세요. 슬리퍼나 샌들은 발목 부상의 위험이 높습니다.</li>
                                    <li>본인의 체력 수준에 맞춰 걷기 속도와 거리를 조절하고, 피로감이 느껴지면 즉시 휴식을 취해야 합니다.</li>
                                </ol>

                            </div>
                        )}
                    </div>


                    <div className="right-column">

                        <div className="box" style={{ width: '100%' }}>
                            <div className="description">
                                <h5> 소개 </h5>
                                <p>{data.description}</p>
                            </div>

                            <div className="dnlcl">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                    <Ruler size={18} color='#4A5D4E' />
                                    <span><div className='m-name'>산책로 길이 </div> {data.distance}m</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', flexDirection: 'column', marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                        <ParkingCircle size={18} color='blue' />
                                        <div className="m-name">편의 시설</div>
                                    </div>
                                    <div style={{ paddingLeft: '26px', width: '100%' }}>
                                        {renderConvenience(data.convenience)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Clock size={18} color='green' />
                                    <span><div className='m-name'>산책 시간</div> {data.time}분</span>
                                </div>

                                <div className="comment-section" style={{ flex: '0 0 45%', borderRadius: '16px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: 'rgba(0,0,0,0.05)', marginTop: '12px', borderColor: '#A1887F', transition: 'all 0.3s ease' }}>
                                    <h6 style={{ fontWeight: '700', color: '#111' }}>🖍 한줄평 후기 ({comments.length})</h6>

                                    <div className="comment-list-container" style={{ maxHeight: '100px', overflowY: 'auto', paddingRight: '4px' }}>
                                        {comments.length === 0 ? (
                                            <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>첫 번째 후기를 남겨보세요!</p>
                                        ) : (
                                            comments.map((comment) => (
                                                <div key={comment.id} style={{ background: '#f8fafc', padding: '10px 10px', borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '14px', color: '#334155', textAlign: 'left' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'green', marginRight: '8px' }}>walk-friend</span>
                                                    {comment.text}
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                        <textarea
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="산책로에 대한 따뜻한 후기를 익명으로 남겨주세요."
                                            style={{ flex: 1, height: '40px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', resize: 'none', outline: 'none', transition: 'all 0.2s ease-in-out' }}
                                        />
                                        <button
                                            onClick={addComments}
                                            style={{ width: '80px', background: 'green', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                                        >
                                            등록
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    className="nav-button"
                    onClick={() => {
                        if (data && data.nav) {
                            setShowWebsite(!showWebsite);

                            setTimeout(() => {
                                navRef.current?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }, 300);

                        } else {
                            alert("등록된 사이트 링크가 없습니다!");
                        }
                    }}
                >
                    네비게이션
                </button>


                <div ref={navRef} style={{ width: '100%' }}>

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
                                src={navUrl}
                                title={`${data.name} 웹사이트`}
                                style={{ width: '100%', height: '600px', border: 'none', backgroundColor: 'white' }}
                            />
                        </motion.div>
                    )}
                </div>
            </div>

        </motion.div>
    );

}

export default Trail;