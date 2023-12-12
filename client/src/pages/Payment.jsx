import React,{useState,useEffect} from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux';


import {TiTick} from 'react-icons/ti'

import Loading from '../components/Loading';
import CartProductCard from '../components/CartProductCard';
import Empty from '../components/Empty'
import AlertBox from '../components/AlertBox'

import { OrdersRequest } from '../apiCalls/OrdersRequest';
import { GenerateOrderId } from '../apiCalls/GenerateOrderId';

import { userDetailsAction } from '../actions/userDetails';


import "../styles/payment.css"

const Payment = () => {
	const dispatch = useDispatch();
	const loadAllData = ()=>{
        dispatch(userDetailsAction());
    }
    let {loading=true,status,userInfo} = useSelector((state)=>state.userDetailsReducer);
    const [actualPrice, setActualPrice] = useState(0);
	const [discount, setDiscount] = useState(0);
	const [deliveryPrice, setDeliveryPrice] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);

	const [emptyBox, setEmptyBox] = useState('none');
	const [notdeliverableError, setNoteliverableError] = useState('none');
	const [lessStockError, setLessStockError] = useState('none');

	const getprices = (products)=>{
		let actualPrice = 0,price=0,delivery=0;
		for(let i in products){
			actualPrice = actualPrice+ (products[i].actualPrice)*products[i].qty;
			price = price + (products[i].price)*products[i].qty;
		}
		let discount = actualPrice-price;
		if(price<1000){
			delivery = 50;
		}
		let total = price+delivery;
		return {actualPrice,discount,delivery,total};
	}


	let initialCart = sessionStorage.getItem('orderCart');
	if(!initialCart){
		initialCart = "[]";
	}
	initialCart = JSON.parse(initialCart);
	const [orderCartArray, setOrderCartArray] = useState(initialCart);
	const [orderCartStr, setOrderCartStr] = useState(JSON.stringify(orderCartArray));
	
	const setAllPrices = ()=>{
		let {actualPrice,discount,delivery,total} = getprices(orderCartArray);
		setActualPrice(actualPrice);
		setDiscount(discount);
		setDeliveryPrice(delivery);
		setTotalPrice(total);
	}

	// for changing qty of product 
	const changeQty = (id,newQty)=>{
		for(let i in orderCartArray){
			if(orderCartArray[i].productId==id){
				orderCartArray[i].qty = newQty;
				break;
			}
		}
		setOrderCartArray(orderCartArray);
		setOrderCartStr(JSON.stringify(orderCartArray));
	}

	// deleting from orders list 
	const removeFromOrder  = (productId)=>{
		for(let i in orderCartArray){
			if(orderCartArray[i].productId==productId){
				orderCartArray.splice(i,1);
				break;
			}
		}
		setOrderCartArray(orderCartArray);
		setOrderCartStr(JSON.stringify(orderCartArray));
	}

	
	const navigate = useNavigate();
	useEffect(() => {
		console.log(initialCart);
		if(!loading && status==401){
			navigate('/login');
		}
		if(!loading && status==200){
			setAllPrices();
		}
		if(orderCartArray.length==0){
			setEmptyBox('flex');
			sessionStorage.removeItem('orderCart')
		}
	}, [loading,orderCartStr]);

	const [orderplacingLoading, setOrderplacingLoading] = useState(false);
	const continuePayment = async ()=>{
		setOrderplacingLoading(true);
		let cart = [];
		for(let i in orderCartArray){
			if(orderCartArray[i].stock<orderCartArray[i].qty){
				setOrderplacingLoading(false);
				setLessStockError('flex');
				setTimeout(() => {
					setLessStockError('none');
				}, 5000);
				return;
			}
			// if(!orderCartArray[i].pincodes.includes(userInfo.pin)){
			// 	setOrderplacingLoading(false);
			// 	setNoteliverableError('flex');
			// 	setTimeout(() => {
			// 		setNoteliverableError('none');
			// 	}, 5000);
			// 	return;
			// }
			cart.push({productId:orderCartArray[i].productId,qty:orderCartArray[i].qty,img:orderCartArray[i].img
			,price:orderCartArray[i].price,brand:orderCartArray[i].brand,name:orderCartArray[i].name,color:orderCartArray[i].color,
		size:orderCartArray[i].size});
		}
		let dateTime = new Date();
		let months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];
		let date = dateTime.getDate() + " " + months[dateTime.getMonth()] + " " + dateTime.getFullYear();
		let order = {
			email:userInfo.email,
			cart:cart,
			totalPrice:totalPrice,
			name:userInfo.name,
			pin:userInfo.pin,
			phone:userInfo.phone,
			address:userInfo.address,
			city:userInfo.city,
			state:userInfo.state,
			locality:userInfo.locality,
			date:date,
			status:'ordered'
		}
		const resOfGeneratingOrderId = await GenerateOrderId(totalPrice);
		let orderId = resOfGeneratingOrderId.id;
		const options = {
			"key": "rzp_test_eycFmFW3KelSBN",
			"amount": totalPrice*100, 
			"currency": "INR",
			"name": userInfo.name,
			"image": "/images/imp/logo.png",
			"order_id": orderId, 
			"handler": async function (response){
				order['orderId'] = orderId;
				order['time'] = Date.now();
				const res = await OrdersRequest(order);
				if(res.status==201){
					loadAllData();
					setOrderplacingLoading(false);
					sessionStorage.removeItem('orderCart');
					navigate('/success?message=your order is placed successfully');
				}
			},
			"modal": {
				"ondismiss": function(){
					setOrderplacingLoading(false);
				 }
			},
			"prefill": {
				"name": userInfo.name,
				"email": userInfo.email,
				"contact": "+91" + userInfo.phone,
			},
			"notes": {
				"address": userInfo.address
			},
			"theme": {
				"color": "#0067e7"
			}
		};
		var rzp = new window.Razorpay(options);
		rzp.open();
		rzp.on('payment.failed', function (response){
			console.log('cancelled');
		});
	}

	

    return (
        <div id="payment">
			<div className='alertBox' style={{display:emptyBox}}>
                <div className="box">
                    <div className="subHeading font1 mb-2" style={{color:'gray'}}>Empty</div>
                    <div className="font1 mb-3">You have nothing to checkout lets back to home page</div>
                    <Link className="btn btn-primary" to='/'>Home</Link>
                </div>
            </div>
			<AlertBox content="Please remove or dec the quantity of specified items" status="500" display={lessStockError} />
			<AlertBox content="Please remove the items which are not deliverable to your pincode" status="500" display={notdeliverableError} />
			{!orderCartArray && <Empty />}
            {orderCartArray && loading && <Loading />}
			{orderplacingLoading && <Loading/>}
            {orderCartArray && !loading && status==200 &&
                <div className="d-flex fc">
                    <div className="container-fluid containerAll">
                        <div className="box mt-3">
                            <div className="font1" style={{fontWeight:700}}>Shiping adress to deliver your product</div>
                            <div className="font1">{userInfo.name}</div>
                            <div className=''>{userInfo.address} , {userInfo.locality} , {userInfo.city} , {userInfo.state}({userInfo.pin})</div>
                            <Link to={'/addressInfo'} className='btn btn-secondary'>Edit Now</Link>
                            <div className="check"><TiTick /></div>
                        </div>
                        <div id="productSummaryCheckout" className='mt-3'>
                            <div className="bgColor py-3 px-3 font1" style={{color:'white'}}>Product Summary</div> 
                                {orderCartArray && orderCartArray.map((product,ind)=>(
                                    <CartProductCard key={ind} product={product} type='order' changeQty={changeQty} removeFromOrder={removeFromOrder} />
                                ))}
                        </div>
                    </div>
                    <div className="container-fluid containerPrices">
						<div className="productSummaryBox w-100">
							<div className="font1  subHeading">Price Details</div>
							<div className="d-flex justify-content-between my-2">
								<div className="font1">Price</div>
								<div>₹{actualPrice}</div>
							</div>
							<div className="d-flex justify-content-between my-2">
								<div className="font1">Discount</div>
								<div className='text-success'>-₹{discount}</div>
							</div>
							<div className="d-flex justify-content-between my-2">
								<div className="font1">Delivery Charges</div>
								<div className='text-danger'>₹{deliveryPrice}</div>
							</div>
							<div className="d-flex justify-content-between mt-4 total">
								<div className="font1">Total Price</div>
								<div>₹{totalPrice}</div>
							</div>
							<div onClick={continuePayment}  className="btn w-100 bgColor" style={{color:'white'}}>Continue Payment</div>
						</div>
					</div>
                </div>
            }
        </div>
    )
}

export default Payment