import React,{useState,useRef,useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import  AlertBox from '../components/AlertBox'


import {deliverProduct} from '../apiCalls/deliverProduct'

const AllOrdersCard = ({product,type,loadAllDeliveredOrders}) => {


    const deliverIt = ()=>{
        deliverProduct(product.email,product.date,product.time);
        loadAllDeliveredOrders({status:'ordered'});
    }

    return (
        <div className="box">
            <div className="items mb-3">
                <div className="subHeading font1 date">{product.date}</div>
                {product.cart.map((item,ind)=>(
                    <div className="desc">
                        <div className="brand font1">{item.brand}</div>
                        <div className="name font1 ms-2"> - {item.name} ({item.qty})</div>
                    </div>
                ))}
            </div>
            <div className="totalPrice">Total price : ₹{product.totalPrice}</div>
            <div className="userInfo my-3">
                <div className="email">{product.email}</div>
                <div className="name">{product.name}</div>
                <div className="address">{product.address} , {product.locality} , {product.city} , {product.state}({product.pin})</div>
                <div className="pin">{product.pin}</div>
            </div>
            <div className="text-secondary font1 text-center">{product.orderId}</div>
            {type=='ordered' && <div className="btn btn-success w-100 mt-2" style={{color:'white'}} onClick={deliverIt}>Deliver It</div>}
        </div>
    )
}

export default AllOrdersCard


