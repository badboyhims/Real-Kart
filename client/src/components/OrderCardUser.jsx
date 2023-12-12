import React from 'react'
import {Link} from 'react-router-dom'




const OrderCardUser = ({product}) => {
    return (
        <div className="boxUser my-4">
            <div className="orderDateUser">Ordered on {product.date}</div>
            <div className="px-2">
                {product.cart.map((item,ind)=>(
                    <div key={ind} className="descUser">
                        <div className="smallBox">
                            <img src={item.img} alt="no image" />
                            <div className="qty">{item.qty}</div>
                        </div>
                        <Link to={'/product?name='+item.name+'&brand='+item.brand+'&color='+item.color+'&size='+item.size} className="d-flex bigBox">
                            <div className="d-flex flex-column">
                                <div className="brand font1">{item.brand}</div>
                                <div className="name font1 pe-3 mt-2">{item.name}</div>
                            </div>
                            <div className="price text-success">₹{item.price}</div>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="totalPriceUser">Total price : ₹{product.totalPrice}</div>
            <div className="text-secondary font1 text-center pb-3">{product.orderId}</div>

        </div>
    )
}

export default OrderCardUser


