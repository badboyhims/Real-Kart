import React,{useState,useEffect} from 'react'

import {TiTick} from 'react-icons/ti'

const AlertBox = ({content,status,display}) => {

	
	
	return (
		<div id="alerts" style={{display:display}}>
			<div className="box">
				{status==200?
				<div className="icon" style={{background:"#089a08"}}><TiTick/></div>
				:<div className="icon" style={{background:"red"}}>!</div>
				}
				<div className="font1">{content}</div>
			</div>
		</div>
	)
}

export default AlertBox