import { useEffect , useState , useRef } from "react";
import { useNavigate } from 'react-router'
import { ListGroup , Form } from 'react-bootstrap';
import "./Main.css";
import '../page2/Trail'
import { AlignRight, Bold } from "lucide-react";

function Main({Data,showIntro,setShowIntro}){
    // const [showIntro, setShowIntro] = useState(true); // 제일 처음 화면 보이기, 이후 false
    // 상세페이지에서 메인 돌아갈때 안뜨게 만들기 위해서 Navigation.jsx로 이동.
    const [searchText, setSearchText] = useState(""); // 검색용
    const [hidePark, setHidePark] = useState(false); // 공원 숨기기
    const [hideTrail, setHideTrail] = useState(false); // 산책로 숨기기
    const [showCurrentPlace, setShowCurrentPlace] = useState(false); // 현재 위치 보이기
    const [selectedPlaceId, setSelectedPlaceId] = useState(null); // 현재 클릭중인 장소 표시
    const [selectedPlace, setSelectedPlace] = useState(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const currentPlaceMarkerRef = useRef(null);
    const infoWindowRef = useRef(null);
    const navigate = useNavigate();
    
    const [currentLat, setCurrentLat] = useState(null);
    const [currentLng, setCurrentLng] = useState(null);
    const [destination, setDestination] = useState(null); 
    const [location, setLocation] = useState(null);
    const [distance, setDistance] = useState(0);
    // const [fav , setFav] = useState(false);

    const filteredData = Data.filter((item) => { // 오른쪽 Group에서 보여줄 것, true인것만 표현
        const isFavorite = localStorage.getItem(`favorites_${item.id}`);
        if(isFavorite) return false;
        if (hidePark && item.type === "공원") return false;
        if (hideTrail && item.type === "산책로") return false;
        if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())){ 
            return false; 
        }
        return true;
    });
    // const favoriteData = Data.filter((item) => { // 오른쪽 Group에서 보여줄 것, true인것만 표현
    //     const isFavorite = localStorage.getItem(`favorites_${item.id}`);
    //     return isFavorite;
    // });
    

    useEffect(() => {
        if(showCurrentPlace){
            getBrowserLocation();
        } 
        else {
            if(currentPlaceMarkerRef.current !== null){
                currentPlaceMarkerRef.current.setMap(null);                  
            }
        }
    },[showCurrentPlace,currentLat,currentLng])


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

    useEffect(()=> {
        if(currentLat && currentLng && selectedPlace){
            const selected_lat = selectedPlace.lat;
            const selected_lng = selectedPlace.lng;
            const Departure = new naver.maps.LatLng(currentLat,currentLng);
            const Destination = new naver.maps.LatLng(selected_lat,selected_lng);
            setDistance(mapRef.current.getProjection().getDistance(Departure,Destination));
        }
    },[selectedPlace,currentLat,currentLng])
    // 현재 위치 반환 코드 (HTML5 Geolocation API)
    // HTML5 Geolocation API는 브라우저 내장이므로 무료.
    const getBrowserLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                    const c_lat = position.coords.latitude;
                    const c_lng = position.coords.longitude;
                    if(c_lat && c_lng){
                        setCurrentLat(c_lat);    
                        setCurrentLng(c_lng);
                        if(currentPlaceMarkerRef.current !== null) currentPlaceMarkerRef.current.setMap(null);
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

    const moveMap = (place) => { // Group에서 새로운 위치를 찍으면 이동한다.
        if (!mapRef.current) return;
        const moveLocation = new window.naver.maps.LatLng(
            place.lat,
            place.lng
        )

        setLocation(moveLocation);
        setSelectedPlaceId(place.id); // 그룹멤버 클릭시 , 클릭 되었음을 보여줌
        setSelectedPlace(place); // 멤버 클릭시 그 장소를 저장함
        if(moveLocation !== null) {
                mapRef.current.panTo(moveLocation); // 천천히 이동
                mapRef.current.setZoom(15);
                // 기존 마커 지우기
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
            // 새 마커 만들기
            markerRef.current = new window.naver.maps.Marker({
                position: moveLocation,
                map: mapRef.current
            });
            setTimeout(() => {
                const btn = document.getElementById("detail-btn");
                if (!btn) return;
                btn.onclick = () => {
                    if (place.type === "공원") {
                        navigate(`/park/${place.id}`, {
                            // state: { data: place }
                            state : {cLat : currentLat , cLng : currentLng , dist : distance}
                        });
                    }
                    else {
                        navigate(`/trail/${place.id}`, {
                            // state: { data: place }
                            state : {cLat : currentLat , cLng : currentLng , dist : distance}
                        });
                    }
                };
            }, 100);
        }
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
                        <p className="searchData">검색 결과 {filteredData.length}개</p>
                    </div>
                    {/* 검색하면 아래 리스트에서 해당하는것만 나오게. */}
                    <ListGroup className="nameList">
                    {/* {
                        favoriteData.length>0 && favoriteData.map((item)=>{
                                <>
                                    <ListGroup.Item
                                        key={item.id}
                                        variant="light"
                                        onClick={() => moveMap(item)}
                                        style={{ cursor: "pointer" }}
                                        className={item.id === selectedPlaceId ? "selectedPlace":""}
                                    >
                                    <button className="favorite_btn" key={item.id} onClick={(e)=>{
                                        e.stopPropagation();
                                        if(localStorage.getItem(`favorite_${item.id}`) === 'true') 
                                            localStorage.removeItem(`favorite_${item.id}`);
                                        else localStorage.setItem(`favorite_${item.id}`,'true');
                                    }}>★</button>
                                        {item.name}
                                    </ListGroup.Item>
                                </>

                        })
                    }
 */}

                    {
                        // 만약 길이가 0 이다 -> 아무것도 없다.
                        filteredData.length === 0 
                        ? (
                            <ListGroup.Item>
                                조건에 맞는 결과가 없습니다.
                            </ListGroup.Item>
                        )
                        :
                        (
                            filteredData.map((item) => ( // return
                                <>
                                    <ListGroup.Item
                                        key={item.id}
                                        variant="light"
                                        onClick={() => moveMap(item)}
                                        style={{ cursor: "pointer" }}
                                        className={item.id === selectedPlaceId ? "selectedPlace":""}
                                    >
                                    <button className="favorite_btn" key={item.id} onClick={(e)=>{
                                        e.stopPropagation();
                                        if(localStorage.getItem(`favorite_${item.id}`) === 'true') 
                                            localStorage.removeItem(`favorite_${item.id}`);
                                        else localStorage.setItem(`favorite_${item.id}`,'true');
                                    }}>☆</button>
                                        {item.name}
                                    </ListGroup.Item>
                                </>
                            ))
                        )
                    }
                    </ListGroup>
                    <div className="switch-container-horizontal">
                        <Form.Check 
                            type="switch"
                            id="trail-switch"
                            label="산책로 숨김"
                            className="me-3" /* 오른쪽 간격 띄우기 */
                            checked={hideTrail}
                            onChange={(e) => setHideTrail(e.target.checked)}
                        />
                        <Form.Check 
                            type="switch"
                            id="park-switch"
                            label="공원 숨김"
                            className="me-3" /* 오른쪽 간격 띄우기 */
                            checked={hidePark}
                            onChange={(e) => setHidePark(e.target.checked)}
                        />
                        <Form.Check 
                            type="switch"
                            id="current-place-switch"
                            label="현재 위치"
                            checked={showCurrentPlace}
                            onChange={(e) => setShowCurrentPlace(e.target.checked)}
                        />
                    </div>
                </div>
                {
                    selectedPlace && 
                    <div key={selectedPlace.id} className={`showSelectedPlace`} style={{ textAlign: "center" }}>
                        <p><span className="titlePlace">{selectedPlace.name}</span> <span><button className="btn_close" onClick={()=>{
                            setSelectedPlace(null);   
                            setSelectedPlaceId(null);             
                        }}>X</button></span></p>
                        <p>
                            <img src={selectedPlace.image} className="selectedPlaceImg" alt={selectedPlace.name}/>
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
                        {
                            // 일단은 2개만 출력
                            <p>태그 : {selectedPlace.tags[0]}, {selectedPlace.tags[1]}</p>
                        }
                        {
                            showCurrentPlace &&
                            <p>현재 위치로부터 약 {Math.floor(distance/100)/10}KM</p>
                        }
                        </div>
                        <button id="detail-btn">상세 보기</button>
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