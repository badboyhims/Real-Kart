import React,{useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'


import ProductCard from '../components/ProductCard'
import OrderCardUser from '../components/OrderCardUser'
import Loading from '../components/Loading'
import Empty from '../components/Empty'



const UserOrders = () => {
    let {loading=true,status,orders} = useSelector((state)=>state.userDetailsReducer);
    const navigate = useNavigate();
    useEffect(() => {
        if(!loading && status!=200){
            navigate('/login');
        }
    }, [loading])
    
    return (
        <div className='pb-5 pt-3 orders'>
            <div className="container-fluid">
                <div className="heading textColor font1 text-center">Your Orders</div>
                {loading && <Loading />}
                {!loading && status==200 &&  orders.length==0 && <Empty/>}
                {!loading && status==200 && orders.map((product,ind)=>(
                    <OrderCardUser product={product} key={ind} />
                ))}
            </div>
        </div>
    )
}

export default UserOrders