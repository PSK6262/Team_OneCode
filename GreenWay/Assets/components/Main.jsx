import { useEffect , useState , useRef } from "react";
import { useNavigate } from 'react-router'
import { ListGroup , Form } from 'react-bootstrap';
import { Rnd } from 'react-rnd';
import "./Main.css";
import ListMain from "./ListMain.jsx";

function Main({Data,showIntro,setShowIntro}){
    const [searchText, setSearchText] = useState(""); // 검색용
    const [hidePark, setHidePark] = useState(false); // 공원 숨기기
    const [hideTrail, setHideTrail] = useState(false); // 산책로 숨기기
    const [showCurrentPlace, setShowCurrentPlace] = useState(false); // 현재 위치 보이기
    const [selectedPlace, setSelectedPlace] = useState(null); // 현재 클릭중인 장소 정보
    const mapRef = useRef(null); // 렌더링 되어도 유지되는 변수 = useRef
    const markerRef = useRef(null);
    const currentPlaceMarkerRef = useRef(null);
    const mapContainerRef = useRef(null);
    const [currentLat, setCurrentLat] = useState(null);
    const [currentLng, setCurrentLng] = useState(null);
    const [distance, setDistance] = useState(0);
    const [fav, setFav] = useState([]);
    const navigate = useNavigate();

    // Fav 버튼 클릭시 작동
    const changeFav = () =>{
        const isFavorite = Data.filter((item)=>{
            if(localStorage.getItem(`favorite_${item.id}`) === "true") return true;
            return false;
        })
        setFav(isFavorite);
    }

    // 오른쪽 Group에서 보여줄 것, true인것만 표현
    const filteredData = Data.filter((item) => {
        const Favorite = localStorage.getItem(`favorite_${item.id}`);
        if(Favorite) return false;
        if (hidePark && item.type === "공원") return false;
        if (hideTrail && item.type === "산책로") return false;
        if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())){ 
            return false; 
        }
        return true;
    });

    // Group에서 새로운 위치를 찍으면 이동한다.
    const moveMap = (place) => { 
        if (!mapRef.current) return;
        const moveLocation = new window.naver.maps.LatLng(
            place.lat,
            place.lng
        )
        setSelectedPlace(place); // 멤버 클릭시 그 장소를 저장함
        mapRef.current.panTo(moveLocation); // 천천히 이동
        mapRef.current.setZoom(15);
        
        // 기존 마커 지우기
        markerRef.current?.setMap(null);
        
        // 새 마커 만들기
        markerRef.current = new window.naver.maps.Marker({
        position: moveLocation,
            map: mapRef.current
        });
    };

    // 상세보기 버튼 누르면 상세 페이지 이동
    const moveDetail = () => {
        if (!selectedPlace) return;
        const path = selectedPlace.type === "공원" ? `/park/${selectedPlace.id}` : `/trail/${selectedPlace.id}`;
        navigate(path,{state : {cLat : currentLat , cLng : currentLng , dist : distance}});
    }

    // Fav 버튼 이벤트
    useEffect(()=>{
        changeFav();
    },[Data])

    // 마커 표시
    useEffect(() => {
        if(showCurrentPlace){
            getBrowserLocation();
        } 
        else {
            currentPlaceMarkerRef.current?.setMap(null);                  
        }
    },[showCurrentPlace])

    // 네이버 지도 표시 (API 사용)
    useEffect(() => {
        if (!window.naver) return;
        mapRef.current = new window.naver.maps.Map("map", {
            center: new window.naver.maps.LatLng(
                Data?.[0]?.lat,
                Data?.[0]?.lng
            ), zoom: 15 }
        );
    }, []); 

    // 거리 표시용  
    useEffect(()=> { 
        if(currentLat && currentLng && selectedPlace){
            const selected_lat = selectedPlace.lat;
            const selected_lng = selectedPlace.lng;
            const Departure = new window.naver.maps.LatLng(currentLat,currentLng);
            const Destination = new window.naver.maps.LatLng(selected_lat,selected_lng);
            setDistance(mapRef.current.getProjection().getDistance(Departure,Destination));
        }
    },[selectedPlace,currentLat,currentLng])

    // 키보드 ESC 누를 시 정보창 꺼짐
    useEffect(() => {
        if (!selectedPlace) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSelectedPlace(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedPlace]);

    // 현재 위치 반환 코드 (HTML5 Geolocation API)
    // HTML5 Geolocation API는 브라우저 내장이므로 무료.
    const getBrowserLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                    const c_lat = position.coords.latitude;
                    const c_lng = position.coords.longitude;
                    if(c_lat != null && c_lng != null){
                        setCurrentLat(c_lat);    
                        setCurrentLng(c_lng);
                        currentPlaceMarkerRef.current?.setMap(null);
                        currentPlaceMarkerRef.current = new window.naver.maps.Marker({
                        position: new window.naver.maps.LatLng(c_lat,c_lng),
                        map: mapRef.current});
                    }
                },
                (error)=>{
                    alert(`위치 권한 거부 또는 오류 : `, error);
                }
            );
        } else {
            alert(`이 브라우저는 위치 정보를 지원하지 않습니다.`);
        }
    }
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
                <div className="maps" ref={mapContainerRef}>
                    <div className="map-placeholder">
                        <div id="map"></div>
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
                        <button className="search-btn-close" onClick={()=>{
                            setSearchText("");
                        }}>X</button>
                    </div>
                    <p className="searchData">검색 결과 {filteredData.length}개</p>
                    {/* 검색하면 아래 리스트에서 해당하는것만 나오게. */}
                    <ListGroup className="nameList">
                        <ListMain list={filteredData} changeFav={changeFav} 
                            selectedPlaceId={selectedPlace?.id} moveMap={moveMap} isFav={true}></ListMain>
                    </ListGroup>
                    <p className="searchData">즐겨찾기 {fav.length}개</p>
                    <ListGroup className="nameList_fav">
                    {
                        // 0 이상일때만 출력함
                        fav.length > 0 &&  <ListMain list={fav} changeFav={changeFav}
                        selectedPlaceId={selectedPlace?.id} moveMap={moveMap} isFav={false}/>
                    }
                    </ListGroup>
                    <div className="switch-container-horizontal">
                        <Form.Check 
                            type="switch"
                            id="trail-switch"
                            label="산책로 숨김"
                            className="me-3 main-switches" /* 오른쪽 간격 띄우기 */
                            checked={hideTrail}
                            onChange={(e) => setHideTrail(e.target.checked)}
                        />
                        <Form.Check 
                            type="switch"
                            id="park-switch"
                            label="공원 숨김"
                            className="me-3 main-switches" /* 오른쪽 간격 띄우기 */
                            checked={hidePark}
                            onChange={(e) => setHidePark(e.target.checked)}
                        />
                        <Form.Check 
                            type="switch"
                            className="main-switches"
                            id="current-place-switch"
                            label="현재 위치"
                            checked={showCurrentPlace}
                            onChange={(e) => setShowCurrentPlace(e.target.checked)}
                        />
                    </div>
                </div>
                {
                    selectedPlace && 
                    <Rnd bounds={mapContainerRef.current} enableResizing={"false"} default={{x:10,y:350}}>
                        <div key={selectedPlace.id} className={`showSelectedPlace ` + (showCurrentPlace && "currentPlaceBtnOn") +" " + (selectedPlace.type === '산책로' && "currentPlaceTypeTrail") } style={{ textAlign: "center" }}>
                            <p><span className="miniViewTitlePlace" style={{fontSize:'14px'}}>{selectedPlace.name} ({selectedPlace.type})</span> <span><button className="btn_close" onClick={()=>{
                                setSelectedPlace(null);           
                            }}>X</button></span></p>
                            <p>
                                <img src={selectedPlace.image} className="selectedPlaceImg" alt={selectedPlace.name} draggable={false}/>
                            </p>
                            <div className={"infoArea " + (showCurrentPlace && "currentPlaceBtnOn") +" "+ (selectedPlace.type === '산책로' && "currentPlaceTypeTrail")}>
                            {
                                <>
                                    <p style={{color:'#000000'}}>{selectedPlace.address}</p>
                                    
                                    {/* // 일단은 2개만 출력, 나머지는 상세보기에서 */}
                                    <p>태그 : {selectedPlace.tags[0]}, {selectedPlace.tags[1]}</p>
                                    
                                    {selectedPlace.distance !== 0 && 
                                    <span>총 길이 {Number(selectedPlace.distance) / 1000} KM ,</span>}
                                    
                                    {selectedPlace.time !== 0 && 
                                    <span> 약 {selectedPlace.time}분 소요</span>}
                                    
                                    {showCurrentPlace &&
                                    <p style={{color:'#777'}}>현재 위치로부터 약 {Math.floor(distance/100)/10}KM</p>}
                                </>
                            }
                            </div>
                            <button id="detail-btn" onClick={moveDetail}>상세 보기</button>
                        </div>
                    </Rnd>
                }
            </div>
            <div className="global-footer">
                <p>© 2026 OneCode All rights reserved. | naverAPI 활용 팀 과제</p>
            </div>
        </>
    )
}

export default Main