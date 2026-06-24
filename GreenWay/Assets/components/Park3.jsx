import "./Park3.css";
import parksData from "../data/parksData";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

function Park3() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [vusdml, setVusdml] = useState(false);

  useEffect(() => {
    const park = parksData.find((item) => item.id == id);

    if (park && park.type == "공원") {
      setData(park);
    } else {
      setData(null);
    }
  }, [id]);

  if (!data) {
    return (
      <div>
        <h3 style={{ fontSize: "24px" }}> 공원을 찾을 수 없습니다 !</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="detail-header">
        <div className="name">
          <h2>{data.name}</h2>
          <span className="tag">{data.type}</span>
        </div>
        <p className="address">주소: {data.address}</p>
      </div>

      <div className="main">
        <div className="img">
          <img src={data.image} />
        </div>

        <div className="box">
          <div className="description">
            <h5> 공원 소개 </h5>
            <p>{data.description}</p>
          </div>

          <div className="button">
            <button className="convenience" onClick={() => setVusdml(!vusdml)}>
              편의시설 및 주요시설 위치 보기
            </button>

            {vusdml && (
              <div className="dnlcl">
                <ul>
                  {data.convenience &&
                    data.convenience.map((text, idx) => <li> {text}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Park3;
