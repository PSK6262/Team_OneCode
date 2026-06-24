import { Card, Row } from "react-bootstrap";
import parksData from "../data/parksData.js";


function ParkCard({ Data, index }) {

    return (
        <Row>
            <h1>{Data.name}</h1>
            <div className='trailImg-box'></div>
            <Card style={{ width: '23rem', marginLeft: 'auto' }}>
                <Card.Body>
                    <div className="inner-box">
                        <h5>주소</h5>
                        <Card.Text>{Data.address}</Card.Text>
                    </div>
                </Card.Body>
                <Card.Body>
                    <div className="inner-box">
                        <h5>특징</h5>
                        <Card.Text>{Data.description}</Card.Text>
                    </div>
                </Card.Body>
                <Card.Body>
                    <div className="inner-box">
                        <h5>산책로 길이</h5>
                        <Card.Text>{Data.distance}km</Card.Text>
                    </div>
                </Card.Body>
                <Card.Body>
                    <div className="inner-box">
                        <h5>편의 시설</h5>
                        <Card.Text>{Data.convenience}</Card.Text>
                    </div>
                </Card.Body>
            </Card>
        </Row>
    )
}