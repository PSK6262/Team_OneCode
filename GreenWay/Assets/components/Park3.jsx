import "./Park3.css";
import parksData from "../data/parksData";
import { useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

function Park3() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewUser, setReviewUser] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [savebutton, setSaveButton] = useState(false);

  const [showWebsite, setShowWebsite] = useState(false);
  const navRef = useRef(null);
  const reviewRef = useRef(null);

  const [cLat, setCLat] = useState(null);
  const [cLng, setCLng] = useState(null);
  const [navUrl, setNavUrl] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCLat(position.coords.latitude);
          setCLng(position.coords.longitude);
        },
        (error) => console.error("❌ GPS 불통:", error),
      );
    }
  }, []);

  useEffect(() => {
    if (data && data.nav) {
      if (cLat && cLng) {
        const patchedUrl = data.nav.replace("/-/", `/${cLng},${cLat}/`);
        setNavUrl(patchedUrl);
      } else {
        setNavUrl(data.nav);
      }
    }
  }, [data, cLat, cLng]);

  useEffect(() => {
    const park = parksData.find((item) => item.id == id);

    if (park && park.type == "공원") {
      setData(park);
      setReviews(park.reviews || []);

      const isFavorite = localStorage.getItem(`favorite_${id}`) === "true";
      setSaveButton(isFavorite);
    } else {
      setData(null);
      setReviews([]);
    }
  }, [id]);

  const handleReviewSubmit = (e) => {
    if (e) e.preventDefault();

    if (reviewText.trim() === "") {
      alert("후기를 입력해주세요!");
      return;
    }

    const newReview = {
      user: "walk-friend",
      comment: reviewText,
    };

    setReviews([...reviews, newReview]);
    setReviewText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReviewSubmit();
    }
  };

  const handleSaveClick = () => {
    const nextState = !savebutton;
    setSaveButton(nextState);

    if (nextState) {
      localStorage.setItem(`favorite_${id}`, "true");
    } else {
      localStorage.removeItem(`favorite_${id}`);
    }
  };

  const handleShareClick = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("URL이 복사되었습니다.");
      })
      .catch((err) => {
        console.error("복사 실패:", err);
      });
  };

  if (!data) {
    return (
      <div>
        <h3 style={{ fontSize: "24px" }}> 공원을 찾을 수 없습니다 !</h3>
      </div>
    );
  }

  const fadeUpStyle = {
    animation: "fadeUpEffect 0.6s ease-out forwards",
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeUpEffect {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div
        className="park-detail-container"
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          ...fadeUpStyle,
        }}>
        <div className="namebox">
          <div className="parkname">
            <h1>{data.name}</h1>
            <span className="park-tag">{data.type}</span>
            <div className="top-button">
              <button
                className="saveclick"
                onClick={handleSaveClick}
                style={{ color: savebutton ? "gold" : "gray" }}>
                ★
              </button>
              <button className="share" onClick={handleShareClick}>
                ↪
              </button>
            </div>
          </div>
          <div className="address-box">
            <MapPin size={20} color="orange" />
            <p className="parkaddress">{data.address}</p>
            <button
              className="address-btn"
              onClick={() => {
                if (data && data.nav) {
                  setShowWebsite(!showWebsite);

                  setTimeout(() => {
                    navRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 300);
                } else {
                  alert("등록된 사이트 링크가 없습니다!");
                }
              }}>
              길찾기
            </button>
          </div>
        </div>

        <div className="parkmain">
          <div className="park-detail-img">
            <img src={data.image} alt={data.name} />
          </div>

          <div className="park-right-content">
            <div className="parkmainbox">
              <div className="parkdescription">
                <h5> 공원 소개 </h5>
                <p>{data.description}</p>
              </div>

              <div className="parkvusdml">
                <h5 className="parkconvenience">편의시설</h5>
                <div className="parkdnlcl">
                  {data.convenience &&
                    data.convenience.map((text, idx) => (
                      <div key={idx} className="parkvusdmlitem">
                        {text}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="parkvusdmlbutton1">
              <button
                className="parkbtn1"
                onClick={() => {
                  const nextState = !showReviews;
                  setShowReviews(nextState);

                  if (nextState) {
                    setTimeout(() => {
                      reviewRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 300);
                  }
                }}>
                공원 후기 및 후기 작성
              </button>
            </div>
          </div>
        </div>

        <div ref={reviewRef} style={{ width: "100%" }}>
          {showReviews && (
            <div className="park-review-section">
              <div className="park-review-form-box">
                <h5> 후기 작성하기</h5>
                <form
                  onSubmit={handleReviewSubmit}
                  className="park-review-form">
                  <textarea
                    className="park-review-textarea"
                    placeholder="후기를 남겨주세요."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button type="submit" className="park-review-submit-btn">
                    후기 등록
                  </button>
                </form>
              </div>

              <div className="park-review-list-box">
                <h5> 방문자 후기 목록</h5>
                <div className="park-review-list">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((rev, index) => (
                      <div key={index} className="park-review-card">
                        <div className="park-review-header">
                          <span className="park-review-user">
                            {rev.user || "walk-friend"}
                          </span>
                        </div>
                        <p className="park-review-text">{rev.comment || rev}</p>
                      </div>
                    ))
                  ) : (
                    <p className="park-no-review">
                      아직 등록된 후기가 없습니다.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={navRef} style={{ width: "100%", marginTop: "30px" }}>
          {showWebsite && navUrl && (
            <div
              style={{
                width: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                ...fadeUpStyle,
              }}>
              <div
                style={{
                  background: "#e8f5e9",
                  padding: "12px 20px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#2e7d32",
                  fontSize: "15px",
                  borderBottom: "1px solid #dcfce7",
                }}>
                {data.name}
              </div>
              <iframe
                src={navUrl}
                title={`${data.name} Web Nav`}
                allow="accelerometer; gyroscope"
                style={{
                  width: "100%",
                  height: "600px",
                  border: "none",
                  backgroundColor: "white",
                  display: "block",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Park3;
