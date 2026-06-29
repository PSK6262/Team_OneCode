import "./Park3.css";
import parksData from "../data/parksData";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Park3() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewUser, setReviewUser] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [savebutton, setSaveButton] = useState(false);
  const [sharebutton, setShareButton] = useState(false);
  const handleClose = () => setShareButton(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const park = parksData.find((item) => item.id == id);

    if (park && park.type == "공원") {
      setData(park);
    } else {
      setData(null);
    }
  }, [id]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
  };

  if (!data) {
    return (
      <div>
        <h3 style={{ fontSize: "24px" }}> 공원을 찾을 수 없습니다 !</h3>
      </div>
    );
  }

  return (
    <div className="park-detail-container">
      <div className="namebox">
        <div className="parkname">
          <h2>{data.name}</h2>
          <span className="tag">{data.type}</span>
          <div className="top-button">
            <button
              className="saveclick"
              onClick={() => {
                setSaveButton(!savebutton);
              }}
              style={{ color: savebutton ? "gold" : "gray" }}>
              ★
            </button>
            <button
              className="share"
              onClick={() => {
                setShareButton(!sharebutton);
              }}>
              ⤴
            </button>
          </div>
        </div>

        <p className="parkaddress">주소: {data.address}</p>
      </div>

      <div className="parkmain">
        <div className="park-detail-img">
          <img src={data.image} />
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
              onClick={() => setShowReviews(!showReviews)}>
              공원 후기 및 후기 작성
            </button>
          </div>
        </div>
      </div>

      <Modal show={sharebutton} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>공유하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="share-link-box">
            우<button className="share-link-btn">복사</button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {showReviews && (
        <div className="park-review-section">
          <div className="park-review-form-box">
            <h5> 후기 작성하기</h5>
            <form onSubmit={handleReviewSubmit} className="park-review-form">
              <input
                className="park-review-input-user"
                type="text"
                placeholder="닉네임 입력"
                value={reviewUser}
                onChange={(e) => setReviewUser(e.target.value)}
              />
              <textarea
                className="park-review-textarea"
                placeholder="후기를 남겨주세요."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button className="park-review-submit-btn">후기 등록</button>
            </form>
          </div>

          <div className="park-review-list-box">
            <h5> 방문자 후기 목록</h5>
            <div className="park-review-list">
              {data.reviews && data.reviews.length > 0 ? (
                data.reviews.map((rev, index) => (
                  <div key={index} className="park-review-card">
                    <div className="park-review-header"></div>
                    <p className="park-review-text">{rev.comment || rev}</p>
                  </div>
                ))
              ) : (
                <p className="park-no-review">아직 등록된 후기가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Park3;
