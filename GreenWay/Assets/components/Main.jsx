import { useEffect , useState , useRef } from "react";
import { useNavigate } from 'react-router'
import { ListGroup , Form } from 'react-bootstrap';
import "./Main.css";
import '../page2/Trail'
import { AlignRight, Bold } from "lucide-react";

function Main({Data}){
    const [showIntro, setShowIntro] = useState(true); // 제일 처음 화면 보이기, 이후 false
    const [searchText, setSearchText] = useState(""); // 검색용
    const [hidePark, setHidePark] = useState(false); // 공원 숨기기
    const [hideTrail, setHideTrail] = useState(false); // 산책로 숨기기
    const [selectedPlaceId, setSelectedPlaceId] = useState(null); // 현재 클릭중인 장소 표시
    const [selectedPlace, setSelectedPlace] = useState(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const infoWindowRef = useRef(null);
    const navigate = useNavigate();

    const filteredData = Data.filter((item) => { // 오른쪽 Group에서 보여줄 것, true인것만 표현
        if (hidePark && item.type === "공원") return false;
        if (hideTrail && item.type === "산책로") return false;
        if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())){ 
            return false; 
        }
        return true;
    });
    useEffect(() => { // 네이버 지도 표시 (API 사용)
        if (!window.naver) return;
        const mapOptions = {
            center: new window.naver.maps.LatLng(
                Data[0].lat,
                Data[0].lng
            ),
            zoom: 15
        };
            mapRef.current = new window.naver.maps.Map(
            "map",
            mapOptions
        );
    }, []); 

    const moveMap = (place) => { // Group에서 새로운 위치를 찍으면 이동한다.
        if (!mapRef.current) return;
        const location = new window.naver.maps.LatLng(
            place.lat,
            place.lng
        );
        setSelectedPlaceId(place.id); // 그룹멤버 클릭시 , 클릭 되었음을 보여줌
        setSelectedPlace(place); // 멤버 클릭시 그 장소를 저장함
        mapRef.current.panTo(location); // 천천히 이동
        mapRef.current.setZoom(15);
        // 기존 마커 지우기
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }
        // 새 마커 만들기
        markerRef.current = new window.naver.maps.Marker({
            position: location,
            map: mapRef.current
        });
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
                        <p className="searchData">검색 결과 {filteredData.length}개</p>
                    </div>
                    {/* 검색하면 아래 리스트에서 해당하는것만 나오게. */}
                    <ListGroup className="nameList">
                    {
                        // 만약 길이가 0 이다 -> 아무것도 없다.
                        filteredData.length === 0 
                        ? (
                            <ListGroup.Item>
                                조건에 맞는 결과가 없습니다.
                            </ListGroup.Item>
                        )
                        : (
                            filteredData.map((item) => ( // return
                                <ListGroup.Item
                                    key={item.id}
                                    variant="light"
                                    onClick={() => moveMap(item)}
                                    style={{ cursor: "pointer" }}
                                    className={item.id === selectedPlaceId ? "selectedPlace":""}
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
                            className="me-5" /* 오른쪽 간격 띄우기 */
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
                {
                    selectedPlace && 
                    <div key={selectedPlace.id} 
                        className={`showSelectedPlace`} 
                        style={{ textAlign: "center" }}>
                        <p><span className="titlePlace">{selectedPlace.name}</span> <span><button className="btn_close" style={{
                            border:'none',
                            background:'none',
                            position: "absolute",
                            right: "1vh",
                            top: "1.3vh",
                            transform: "translateY(-50%)"             
                        }} onClick={()=>{
                            setSelectedPlace(null);   
                            setSelectedPlaceId(null);             
                        }}>X</button></span></p>
                        <p>
                            <img
                                src={selectedPlace.image}
                                style={{
                                    width: "350px",
                                    height: "200px",
                                    objectFit: "cover"
                                }}
                                alt={selectedPlace.name}
                            />
                        </p>
                        <div className="infoArea">
                        {
                            selectedPlace.distance !== 0 &&
                            <span style={{fontSize:'18px'}}>총 길이 {Number(selectedPlace.distance) / 1000} KM ,</span>
                        }
                        {
                            selectedPlace.time !== 0 &&
                            <span style={{fontSize:'18px'}}> 약 {selectedPlace.time}분 소요</span>
                        }
                        {
                            <p style={{color:'#777'}}>{selectedPlace.address}</p>
                        }
                        </div>
                        <button 
                            id="detail-btn" style={{
                            background: "#03C75A",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 12px"
                        }}>상세 보기</button>
                    </div>
                }
            </div>
            <div className="global-footer">
                <p>© 2026 OneCode All rights reserved. | naverAPI 활용 팀 과제</p>
            </div>
        </>
    )
}

export default Main