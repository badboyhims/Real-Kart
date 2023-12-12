import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'

import { AddToCart } from '../apiCalls/AddToCart'
import { userDetailsAction } from '../actions/userDetails'

import {AiOutlinePlus} from 'react-icons/ai'
import {AiOutlineMinus} from 'react-icons/ai'

import AlertBox from '../components/AlertBox'


import {Card} from 'react-bootstrap'
import '../styles/cartProductCard.css'


// chnage qty function is only for orders products cart 
// and others all function are for cart 


const CartProductCard = ({product,type,changeQty,removeFromOrder}) => {

    let {loading,status,userInfo} = useSelector((state)=>state.userDetailsReducer);
    const [email, setEmail] = useState([]);

    const [successToRemoveFromCart, setSuccessToRemoveFromCart] = useState('none');
    const [outOfStock, setOutOfStock] = useState('none')
    const [error, setError] = useState('none');

    // loading data from redux function
    const dispatch = useDispatch();
    const loadAllData = ()=>{
        dispatch(userDetailsAction());
    }

    const [qty, setQty] = useState(0);
    // function to find qty 
    const findQty = (id,array)=>{
        for(let i in array){
            if(array[i].productId==id){
                return array[i].qty;
            }
        }
    }

    useEffect(() => {
        if(!loading && status==200){
            setEmail(userInfo.email);   
            setQty(findQty(product.productId,userInfo.cart));   
        }
    }, [loading,qty])

    

    const removeProduct= async (e)=>{
        e.stopPropagation();
        e.preventDefault();
        if(type=='cart'){
            const res =  await AddToCart(email,product.productId,false,'update');
             if(res.status==200){
                 setSuccessToRemoveFromCart('flex');
                 setTimeout(() => {
                     setSuccessToRemoveFromCart('none');
                 }, 2000);
                 loadAllData();
             }else{
                 setError('flex');
                 setTimeout(() => {
                     setError('none');
                 }, 2000);
             }
        }else{
            removeFromOrder(product.productId);
        }
    }
    
    const incQuantity = (e)=>{
        e.stopPropagation();
        e.preventDefault();
        if(type=='cart'){
            if(qty<product.stock){
                AddToCart(email,product.productId,true,qty+1,'update');
                loadAllData();
            }else{
                setOutOfStock('flex');
                setTimeout(() => {
                    setOutOfStock('none');
                }, 4000);
            }
        }else{
            if(product.qty<product.stock){
                changeQty(product.productId,product.qty+1);
            }else{
                setOutOfStock('flex');
                setTimeout(() => {
                    setOutOfStock('none');
                }, 4000);
            }
        }
    }
    const decQuantity = (e)=>{
        e.stopPropagation();
        e.preventDefault();
        if(type=='cart'){
            if(qty>1){
                AddToCart(email,product.productId,true,qty-1,'update');
                loadAllData();
            }
        }else{
            if(product.qty>1){
                changeQty(product.productId,product.qty-1);
            }
        }
    }
  return (
    <Link to={'/product?name='+product.name+'&brand='+product.brand+'&color='+product.color+'&size='+product.size} className="cartProductCardLink">
        <AlertBox content="successfully remove from cart" status="200" display={successToRemoveFromCart} />
        <AlertBox content={'sorry only ' + product.stock + ' are available'} status="500" display={outOfStock} />
        <AlertBox content="Some error. Please try after some time" status="500" display={error} />
        <Card className="cartProductCard">
            <Card.Img variant="top" src={product.img} />
            <Card.Body>
                <Card.Title>
                    <div className="font1 brand subHeading textColor">{product.brand}</div>
                </Card.Title>
                <Card.Text>
                    <div className="font1 brand text-secondary">{product.name}</div>
                    <div className="font1 mt-2">Color:{product.color}</div>
                    <div className="font1 mb-2">Size:{product.size}</div>
                    {product.discount>0?
                        <div className="d-flex">
                            <div className="price">₹{product.price}</div>
                            <div className="actualPrice mx-1">₹{product.actualPrice}</div>
                            <div className="discount textColor">{product.discount}%</div>
                        </div>
                        :
                        <div className="d-flex">
                            <div className="price">₹{product.price}</div>
                        </div>
                    }

                    {userInfo.pin && product.pincodes.includes(userInfo.pin) &&
                        product.stock==0
                        ?<div className="font1 text-danger mt-2 subHeading">Out of Stock</div>
                        :<div className="d-flex qty mt-3">
                            <i className='bgColor' onClick={decQuantity}><AiOutlineMinus/></i>
                            <div>{type=='cart'?qty:product.qty}</div>
                            <i className='bgColor' onClick={incQuantity}><AiOutlinePlus/></i>
                        </div>
                    }
                    {product.stock<qty && product.stock>0 &&<div className="font1 text-danger mt-2 subHeading">only {product.stock} are available</div>}

                    {/* {userInfo.pin && !product.pincodes.includes(userInfo.pin) &&
                        <div className="font1 text-danger mt-2 subHeading">Not deliverable to your city</div>
                    } */}

                    
                </Card.Text>
            </Card.Body>
        </Card>
        {type=='cart' && <div className="btn w-100 btn-danger" onClick={removeProduct}>Remove</div>}
        {type=='order' && <div className="btn w-100 btn-danger" onClick={removeProduct}>Remove</div>}
    </Link>
  )
}

export default CartProductCard