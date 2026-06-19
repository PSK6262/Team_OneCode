import { useEffect } from "react";
import { useState } from "react";
import { ListGroup , Form } from 'react-bootstrap';
import "./Main.css";
import '../page2/page2'

function Main({Data}){
    
    let [viewStatus, setViewStatus] = useState('start');
    return(
        <>
            <div className={'main-bg '+ viewStatus} onClick={()=>{setViewStatus('display-none');}}>
                {/* 일단은 바로 사라지지만 나중에 서서히 바꿈 + 지도칸 서서히 보이게 */}
            </div>
            <div className="body_container">
                <div className="maps">
                    <p style={{textAlign:'center'}}>여기에 지도</p>
                </div>
                <div className="nameGroups">
                    <input type="text" placeholder="검색하기" style={{width:"100%"}}/>
                    {/* 검색하면 아래 리스트에서 해당하는것만 나오게. */}
                    <ListGroup className="nameList">
                        {
                            Data.map((item,index)=>{
                                return(
                                    <ListGroup.Item>{item.name}</ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>
                </div>
            </div>
        </>
    )
}

export default Main