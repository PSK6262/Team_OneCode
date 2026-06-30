import { useState, useEffect } from 'react';

// 1. 인자를 객체 형태({ lat, lng })로 받아야 합니다.
function WeatherWidget({ lat, lng }) {
    const API_KEY = "94ba1248b822defcf77d77a621719f4d";
    
    // 2. API 데이터를 저장할 상태(State)를 선언합니다.
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=kr`
                );
                // 3. fetch 응답을 JSON으로 파싱합니다.
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "날씨 정보를 가져오지 못했습니다.");
                }
                // 상태에 날씨 정보를 저장합니다.
                setWeatherData({
                    temperature: data.main.temp,
                    place: data.name,
                    description: data.weather[0].description,
                    icon : data.weather[0].icon
                });
            } catch (err) {
                setError(err.message);
            }
        };
        if (lat && lng) {
            getWeather();
        }
    }, [lat, lng]); // 위도, 경도가 바뀔 때마다 실행됩니다.

    // 4. 상태에 따라 다른 화면을 반환(Render)합니다.
    if (error) return <div>에러 발생: {error}</div>;
    if (!weatherData) return <div>로딩 중...</div>;
    {console.log(weatherData)}
    return (
        <div className='current-place-container' style={{display:'relative'}}>
        {/* 일단은 Cheonan으로밖에 지원하지 않음(영문명). 이후 지역 확대 시 데이터 파일을 만들고 매칭 시켜야 함 */}
            <p className='current-place' style={{fontSize:'16px'}}>천안</p>
            <span className='current-temperature' style={{fontSize:'18px'}}>{Math.round(weatherData.temperature)}°C</span>
            <img src={`https://openweathermap.org/img/wn/${weatherData.icon}.png`}/>
        </div>
    );
}
export default WeatherWidget;