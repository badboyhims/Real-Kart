import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Accordion } from 'react-bootstrap'

import '../styles/orders.css'
import { Offcanvas } from 'react-bootstrap'

import AllOrdersCard from '../components/AllOrdersCard'
import Empty from '../components/Empty'
import Loading from '../components/Loading'
import {GetAllOrdersForAdmin} from '../apiCalls/GetAllOrdersForAdmin'

const NewOrders = () => {
	
    // for iffcanvas filter box by bootstrap 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

	const [filterInputs, setFilterInputs] = useState({
		date:"",orderId:"",email:""
	})

	const handleChange = (e)=>{
		let name = e.target.name;
		let value = e.target.value;
		setFilterInputs({...filterInputs,[name]:value});
	}

	let {loading=true,status,isAdmin} = useSelector((state)=>state.userDetailsReducer);
	const navigate = useNavigate();

	const [areOrdersFetched, setAreordersFetched] = useState(false);
	const [newOrders, setNewOrders] = useState([]);
	const loadAllDeliveredOrders = async (filters)=>{
		setAreordersFetched(false);
		const data = await GetAllOrdersForAdmin(filters);
		setNewOrders(data);
		await setAreordersFetched(true);
	}

	useEffect(() => {
		if(!loading && (status != 200 || !isAdmin)){
            navigate('/login');
        }
		if(!loading && isAdmin){
			loadAllDeliveredOrders({status:'ordered'});
		}
	}, [loading])

	const applyFilters = ()=>{
		let filterData = {status:'ordered'};
		if(filterInputs.date){
			let months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
			let d = filterInputs.date.substr(0,2);
			let m = filterInputs.date.substr(3,2);
			m = parseInt(m-1);
			m = months[m];
			let y = filterInputs.date.substr(6,4);
			let date = d+" "+m+" "+y;
			filterData['date'] = date;
		}
		if(filterInputs.email){
			filterData['email'] =filterInputs.email;
		}
		if(filterInputs.orderId){
			filterData['orderId'] =filterInputs.orderId;
		}
		loadAllDeliveredOrders(filterData);
		setShow(false);
	}


	return (
		<div className='orders'>
			{loading && <Loading />}
			<div className='addFilterButton font1' onClick={handleShow}>
				Add Filter
			</div>
			<Offcanvas show={show} onHide={handleClose}>
				<Offcanvas.Header closeButton></Offcanvas.Header>
				<Offcanvas.Body className='font1'>
					<form action="">
						<div className="filterBox">
							<div className="subHeading font1">Date</div>
							<input className='w-100' name='date' type="text" placeholder='DD/MM/YYYY' value={filterInputs.date} onChange={handleChange}  />
						</div>
						<div className="filterBox">
							<div className="subHeading font1">Order Id</div>
							<input className='w-100' name='orderId' type="text" value={filterInputs.orderId} onChange={handleChange}  />
						</div>
						<div className="filterBox">
							<div className="subHeading font1">Email</div>
							<input className='w-100' name='email' type="text" placeholder='email of customer' value={filterInputs.email} onChange={handleChange}  />
						</div>
						<div className="submit btn w-100" id='filterButton' onClick={applyFilters}>Apply Filters</div>
					</form>
				</Offcanvas.Body>
			</Offcanvas>
			<div className='container'>
				{!areOrdersFetched
					? <Loading />
					:newOrders.length==0
					?<Empty/>
					:newOrders.map((product,ind)=>(
						<AllOrdersCard key={ind} product={product} type='ordered' loadAllDeliveredOrders={loadAllDeliveredOrders} />
					))
				}
			</div>
		</div>
	)
}

export default NewOrders





