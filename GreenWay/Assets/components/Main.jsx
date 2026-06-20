import { useEffect , useState , useRef } from "react";
import { useNavigate } from "react-router";
import { ListGroup , Form } from 'react-bootstrap';
import "./Main.css";

function Main({Data}){
    const [showIntro, setShowIntro] = useState(true); // 제일 처음 보여주는 화면 , 한번 클릭 이후 false
    const [searchText, setSearchText] = useState(""); // 검색에 사용하기 위한 useState

    const [hidePark, setHidePark] = useState(false); // 필터링에 필요한 useState 2개
    const [hideTrail, setHideTrail] = useState(false);

    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const infoWindowRef = useRef(null);
    
    const navigate = useNavigate();

    const filteredData = Data.filter((item) => {
        if (hidePark && item.type === "공원") return false;
        if (hideTrail && item.type === "산책로") return false;
        if (searchText &&
            !item.name.toLowerCase().includes(searchText.toLowerCase()))
            { 
                return false; 
            }

        return true;
    });

    useEffect(() => {
        if (!window.naver) return;

    const mapOptions = {
        center: new window.naver.maps.LatLng(
            37.3595704,
            127.105399
        ),
        zoom: 10
    };
        mapRef.current = new window.naver.maps.Map(
        "map",
        mapOptions
    );
    }, []);

    const moveMap = (place) => {

        if (!mapRef.current) return;

        const location = new window.naver.maps.LatLng(
            place.lat,
            place.lng
        );

        mapRef.current.panTo(location);
        mapRef.current.setZoom(15);

        // 기존 마커 제거
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        // 새 마커 생성
        markerRef.current = new window.naver.maps.Marker({
            position: location,
            map: mapRef.current
        });

        // 기존 InfoWindow 제거
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }

        // 새 InfoWindow 생성
        infoWindowRef.current = new window.naver.maps.InfoWindow({
            content: `
                <div style="
                    padding:10px;
                    text-align:center;
                    min-width:150px;
                ">
                    <strong>${place.name}</strong>
                    <br/>
                    <button id="detail-btn">
                        상세보기
                    </button>
                </div>
            `
        });

        infoWindowRef.current.open(
            mapRef.current,
            markerRef.current
        );
        setTimeout(() => {
            const btn = document.getElementById("detail-btn");
            if (!btn) return;
            btn.onclick = () => {
                if (place.type === "공원") {
                    navigate(`/park/${place.id}`, {
                        state: { data: place }
                    });
                }
                else {
                    navigate(`/trail/${place.id}`, {
                        state: { data: place }
                    });
                }
            };
        }, 100);
    };    

    return(
        <>
            <div className={'main-bg '+ (showIntro ? 'start' : 'fade-out')} 
            onClick={()=>{setShowIntro(false);}}>
                <div className="intro-content">
                    <h1 className="intro-title">잠깐 나가서 걷고 싶을 때</h1>
                    <p className="intro-subtitle">내 주변 걷기 좋은 공원과 산책로 찾기</p>
                    <span className="intro-click-hint">화면을 클릭하면 시작합니다</span>
                </div>
            </div>
            <div className="body_container">
                <div className="maps">
                    <div className="map-placeholder">
                        <div
                            id="map"
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                        ></div>
                    </div>
                </div>
                <div className="nameGroups">
                    <div className="search-box-wrapper">
                        <Form.Control 
                            type="text" 
                            placeholder="🔍  검색어를 입력하세요.." 
                            className="custom-search-input"
                            value={searchText}
                            onChange={(e)=>setSearchText(e.target.value)}
                        />
                    </div>
                    {/* 검색하면 아래 리스트에서 해당하는것만 나오게. */}
                    <ListGroup className="nameList">
                    {
                        filteredData.length === 0
                        ? (
                            <ListGroup.Item>
                                조건에 맞는 결과가 없습니다.
                            </ListGroup.Item>
                        )
                        : (
                            filteredData.map((item) => (
                                <ListGroup.Item
                                    key={item.id}
                                    variant="light"
                                    onClick={() => moveMap(item)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {item.name}
                                </ListGroup.Item>
                            ))
                        )
                    }
                    </ListGroup>
                    <div className="switch-container-horizontal">
                        <Form.Check 
                            type="switch"
                            id="trail-switch"
                            label="산책로 숨김"
                            className="me-4" /* 오른쪽 간격 띄우기 */
                            checked={hideTrail}
                            onChange={(e) => setHideTrail(e.target.checked)}
                        />
                        <Form.Check 
                            type="switch"
                            id="park-switch"
                            label="공원 숨김"
                            checked={hidePark}
                            onChange={(e) => setHidePark(e.target.checked)}
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