import { useEffect } from "react";
import { useState } from "react";
import { ListGroup , Form } from 'react-bootstrap';
import "./Main.css";
import '../page2/page2'

function Main({Data}){
    
    let [showIntro, setShowIntro] = useState(true);
    return(
        <>
            <div className={'main-bg '+ (showIntro ? 'start' : 'fade-out')} 
            onClick={()=>{setShowIntro(false);}}>
            </div>
            <div className="body_container">
                <div className="maps">
                    <div className="map-placeholder">
                        <span className="map-icon">🗺️</span>
                        <p className="map-text">지도를 불러오는 중입니다...</p>
                    </div>
                </div>
                <div className="nameGroups">
                    <div className="search-box-wrapper">
                        <Form.Control 
                            type="text" 
                            placeholder="🔍  검색어를 입력하세요.." 
                            className="custom-search-input"
                        />
                    </div>
                    {/* 검색하면 아래 리스트에서 해당하는것만 나오게. */}
                    <ListGroup className="nameList">
                        {
                            Data.map((item,index)=>{
                                return(
                                    <ListGroup.Item variant="light">{item.name}</ListGroup.Item>
                                )
                            })
                        }    
                    </ListGroup>
                    <div className="switch-container-horizontal">
                        <Form.Check 
                            type="switch"
                            id="trail-switch"
                            label="산책로 숨김"
                            className="me-4" /* 오른쪽 간격 띄우기 */
                        />
                        <Form.Check 
                            type="switch"
                            id="park-switch"
                            label="공원 숨김"
                        />
                    </div>
                </div>
            </div>
            <div className="global-footer">
                <p>© 2026 OneCode All rights reserved. | naverAPI 활용 팀 과제</p>
            </div>
        </>
    )
}

export default Main