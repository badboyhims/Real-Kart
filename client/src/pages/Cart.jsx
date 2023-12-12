import React,{useState,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';


import '../styles/cartProductCard.css'

import CartProductCard from '../components/CartProductCard'
import Loading from '../components/Loading';
import Empty from '../components/Empty';

const Cart = () => {
	let {loading=true,status,userInfo,myCart,isAdmin} = useSelector((state)=>state.userDetailsReducer);
	const [actualPrice, setActualPrice] = useState(0);
	const [discount, setDiscount] = useState(0);
	const [deliveryPrice, setDeliveryPrice] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);

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

	const navigate = useNavigate();
	useEffect(() => {
		if(!loading && status==200 && !isAdmin){
			let {actualPrice,discount,delivery,total} = getprices(userInfo.cart);
			setActualPrice(actualPrice);
			setDiscount(discount);
			setDeliveryPrice(delivery);
			setTotalPrice(total);
		}else if(!loading && status!==200){
            navigate('/login');
		}
	}, [loading])


	const buyProducts = ()=>{
		for(let i in myCart){
			for(let j in userInfo.cart){
				if(userInfo.cart[j].productId==myCart[i].productId){
					myCart[i]['qty'] = userInfo.cart[j].qty;
				}
			}
		}
		let orderCart = myCart;
		orderCart = JSON.stringify(orderCart)
		sessionStorage.setItem('orderCart',orderCart);
		if(userInfo.pin){
            navigate('/payment');
		}else{
			navigate('/addressInfo');
		}
	}
	

	return (
		<div id='cart' className='pt-3 pb-5'>
			{loading &&<Loading/>}
			<div>
				{status==200 && myCart.length===0 && <Empty />}
				<div className="container-fluid fc d-flex align-items-start justify-content-between">
					{ status==200 &&
						<div className='itemsBox'>
							{status==200 && [...userInfo.cart].reverse().map((item,ind)=>(
									myCart.map((product,index)=>(
										item.productId==product.productId && <CartProductCard key={index} product={product} type='cart' />
									))
								))
							}
						</div>
					}
					{status==200 && myCart.length!==0 &&
						<div className="productSummaryBox">
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
							<div onClick={buyProducts} className="btn w-100 bgColor" style={{color:'white'}}>Checkout</div>
						</div>
					}
				</div>
			</div>
			
		</div>
	)
}

export default Cart