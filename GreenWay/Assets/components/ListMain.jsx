import { ListGroup } from "react-bootstrap";
import "./Main.css";
function ListMain({list,fav,changeFav,selectedPlaceId,moveMap}){
    if((list.length === 0 || !list)) return(
        <ListGroup.Item>
            조건에 맞는 결과가 없습니다.
        </ListGroup.Item>
    )
    else return(
        list.map((item,index) => ( // return
            <ListGroup.Item
            key={item.id}
            variant="light"
            onClick={() => moveMap(item)}
            style={{ cursor: "pointer" }}
            className={item.id === selectedPlaceId ? "selectedPlace":""}
            >
            {item.name}
            <button className="non_favorite_btn" onClick={(e)=>{
                e.stopPropagation();
                if(localStorage.getItem(`favorite_${item.id}`) === 'true') {
                    localStorage.removeItem(`favorite_${item.id}`);
                } 
                else {
                    localStorage.setItem(`favorite_${item.id}`,'true');
                }
                changeFav();
                }}>{fav[index] === true ? '★' : '☆'}</button>                                    
                </ListGroup.Item>
            ))
    )
}
export default ListMain;