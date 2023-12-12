import React,{useState,useEffect,useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'

// imoorting css files 
import '../styles/productPage.css'
import {AiFillStar} from 'react-icons/ai'

import Loading from '../components/Loading'
import ReviewCard from '../components/ReviewCard'
import AlertBox from '../components/AlertBox'


import { SelectedProductsDetails } from '../apiCalls/SelectedProductsDetails'

import { CheckForPincode } from '../apiCalls/CheckForPincode'
import { RateProduct } from '../apiCalls/RateProduct'
import { GetReviews } from '../apiCalls/GetReviews'
import { AddToCart } from '../apiCalls/AddToCart'
import {userDetailsAction} from '../actions/userDetails'


const ProductPage = ({}) => {

    const dispatch = useDispatch();
    const loadReduxData = ()=>{
        dispatch(userDetailsAction());
    }

    // data from redux 
    let {loading,status,userInfo,orders,isAdmin} = useSelector((state)=>state.userDetailsReducer);

    const [inputs, setInputs] = useState({
        pincode:"",name:"",comment:"",rating:0
    })

    const [email, setEmail] = useState("");
    const [details, setDetails] = useState([]);
    const [availableForPincode, setAvailableForPincode] = useState(null);


    // changing value of inputs
    let key,value;
    const handleChange = (e)=>{
        key = e.target.name;
        value = e.target.value;
        setInputs({...inputs,[key]:value});
    }



    // getting data of product and reviews from backend 
    const name = new URLSearchParams(window.location.search).get('name');
    const brand = new URLSearchParams(window.location.search).get('brand');
    const color = new URLSearchParams(window.location.search).get('color');
    const size = new URLSearchParams(window.location.search).get('size');

    const id = name.toLowerCase()+" "+brand.toLowerCase()+" "+color+" "+size;
    let data,reviews;
    const [colorsArray, setColorsArray] = useState([]);
    const [sizeArray, setSizeArray] = useState([]);
    const [commentsArray, setCommentsArray] = useState([]);
    const [isProductInCartAlready, setIsProductInCartAlready] = useState(false);

    const fetchProductDetails = async ()=>{
        const productObj = {name:name,brand:brand,color:color,size:size};
        data = await SelectedProductsDetails(productObj);
        data = data[0];
        reviews = await GetReviews(name,brand);
        setDetails(data);
        setCommentsArray(reviews);
        const colorsObj = {name:name,brand:brand,size:size};
        const sizeObj = {name:name,brand:brand,color:color};
        setColorsArray(await SelectedProductsDetails(colorsObj));
        setSizeArray(await SelectedProductsDetails(sizeObj));
    }

    // function to make array of ids from json of ids and qty 
    const findProductIdsArray = (cart)=>{
        let idsArray = [];
        for(let item in cart){
            idsArray.push(cart[item].productId)
        }
        return idsArray;
    }

    useEffect(() => {
        if(loading===false && status==200){
            setEmail(userInfo.email);
            let array = findProductIdsArray(userInfo.cart);
            if(array.includes(id)){
                setIsProductInCartAlready(true);
            }else{
                setIsProductInCartAlready(false);
            }
        }
        fetchProductDetails();
    }, [loading,email,isProductInCartAlready])


    // add to cart 
    const navigate = useNavigate();
    const [successToAddToCart, setSuccessToAddToCart] = useState('none')
    const addToMyCart = async ()=>{
        if(status==200){
            const res = await AddToCart(email,details.productId,true,1,'add');
            if(res.status==200){
                setSuccessToAddToCart('flex');
                setTimeout(() => {
                    setSuccessToAddToCart('none');
                }, 2000);
            }
            loadReduxData();
        }else{
            navigate('/login');
        }
    }
  



    // to check pincode enter by user is correct or not 
    function validatePincode(pin){
        let j;
        if(pin.length ==6){
            for(let i=0;i<6;i++){
                j = pin.charCodeAt(i);
                if(j<48 || j>57){
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    const checkForPin = async(productId,pin)=>{
        let check = await CheckForPincode(productId,pin);
        setAvailableForPincode(check);
    }
    


    // rating box show and hide and verify for the userif he has ordered the product or not

    const checkIsProductInOrders = ()=>{
        for(let i in orders){
            for(let j in orders[i].cart){
                if(orders[i].cart[j].productId==id){
                    return true;
                }
            }
        }
        return false;
    }

    const checkIfAlreadyReviewed = ()=>{
        for(let i in commentsArray){
            if(commentsArray[i].email==userInfo.email){
                return true;
            }
        }
        return false;
    }

    const [cantRate, setCantRate] = useState('none')
    const [ratingBox, setRatingBox] = useState('none');
    const [alreadyRated, setAlreadyRated] = useState('none');
    const showHide = ()=>{
        if(status==200){
            if(checkIsProductInOrders()){
                setCantRate('none');
                if(!checkIfAlreadyReviewed()){
                    if(ratingBox=='none'){
                        setRatingBox('flex')
                    }else{
                        setRatingBox('none');
                    }
                }else{
                    setAlreadyRated('block');
                }
            }else{
                setCantRate('block');
                setAlreadyRated('none');
            }
        }else{
            navigate('/login');
        }
    }


    const [reviewSuccess, setReviewSuccess] = useState('none')
    const [reviewError, setReviewError] = useState('none')
    const [reviewIncomplete, setReviewIncomplete] = useState('none')
    const rateIt = async ()=>{
        if(inputs.name =="" || inputs.rating==0 || inputs.comment==""){
            setReviewError('none');
            setReviewIncomplete('block');
            setReviewSuccess('none');
        }else{
            const res = await RateProduct(userInfo.email,name,brand,inputs.name,inputs.comment,inputs.rating);
            if(res.status==200){
                setReviewError('none');
                setReviewIncomplete('none');
                setReviewSuccess('block');
                setRatingBox('none');
                fetchProductDetails();
            }else{
                setReviewError('block');
                setReviewIncomplete('none');
                setReviewSuccess('none');
            }
        }
    }


    const [outOfStock, setOutOfStock] = useState('none');
    // for buying product 
    const buyProduct = ()=>{
        if(status!=200){
            navigate('/login');
        }else{
            if(details.stock==0){
                setOutOfStock('flex');
                setTimeout(() => {
                    setOutOfStock('none');
                }, 4000);
                return;
            }
            let product = details;
            product['qty'] = 1;
            let orderCart = new Array(product);
            orderCart = JSON.stringify(orderCart)
            sessionStorage.setItem('orderCart',orderCart);
            if(userInfo.pin){
                navigate('/payment');
            }else{
                navigate('/addressInfo');
            }
        }
    }
  

  return (
    <div id='productPage' className='pb-5'>
        <AlertBox content="successfully added to cart" status="200" display={successToAddToCart} />
        <AlertBox content="Sorry , Product is out of stock" status="500" display={outOfStock} />
        {(!details.productId || loading)  && <Loading/>}
        <div className="container">

            <div className="d-flex justify-content-center mainContainer">
                <div className="left">
                    <div className="d-flex w-100 justify-content-center">
                        <img src={details.img} alt={details.name} />
                    </div>
                    {!isAdmin &&
                        <div className='buttons mt-10'>
                            {isProductInCartAlready 
                                ?<Link to={'/mycart'} className="btn btn-warning">Go To cart</Link>
                                :<div className="btn btn-warning" onClick={addToMyCart}>Add To Cart</div>
                            }
                            <div className="btn btn-secondary" onClick={buyProduct}>Buy Now</div>
                        </div>
                    }
                </div>
                <div className="right">

                    <div className="font1 heading brand textColor">{details.brand}</div>
                    <div className="font1 subHeading my-1">{details.name}</div>
                        {details.rating >0
                            ?
                            <div className='d-flex my-3 align-items-center'>
                            <div className="ratingButton bgColor d-flex align-items-center justify-content-center">
                                <div>{details.rating.toPrecision(2)}</div>
                                <AiFillStar />
                            </div>
                            <div className="font1 text-secondary subHeading"> {commentsArray.length} reviews and comments </div>
                            </div>
                            :<div className="font1 text-seconadry">No Reviews yet</div>
                        }

                    {details.discount>0?
                        <b className="d-flex my-3 heading" style={{color:'gray'}}>
                            <div className="price">₹{details.price}</div>
                            <div className="actualPrice">₹{details.actualPrice}</div>
                            <div className="discount textColor">{details.discount}%</div>
                        </b>
                        :
                        <b className="d-flex my-3" style={{color:'gray'}}>
                            <div className="price">₹{details.price}</div>
                        </b>
                    }

                    {details.stock==0 && <div className="font1 text-danger subHeading mb-3">Out Of Stock</div>}
                    
                    <div className="description">{details.description}</div>

                    <div className='font1 mt-2' style={{color:'gray'}}><b>Color:{details.color}</b></div>
                    <div className='font1' style={{color:'gray'}}><b>Size:{details.size}</b></div>


                    <div className="colorsBox">
                        <div className="font1 subHeading textColor mx-2">Colours Available</div>
                        <div className="d-flex py-2 flex-wrap">
                            {colorsArray.map((value,index)=>(
                                <a key={index} href={'/product?name='+value.name+'&brand='+value.brand+'&color='+value.color+'&size='+value.size} className='mx-2 my-2 font1'>
                                    {id==value.productId? <img src={value.img} alt={value.productId}  className='active' />
                                    : <img src={value.img} alt={value.productId} />
                                    }
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="sizeBox mt-2">
                        <div className="font1 subHeading textColor mx-2">Sizes Available</div>
                        <div className="d-flex py-2 flex-wrap">
                            {sizeArray.map((value,index)=>(
                                <a key={index} href={'/product?name='+value.name+'&brand='+value.brand+'&color='+value.color+'&size='+value.size} className='mx-2 my-2 font1'>
                                    {id==value.productId?<div key={index} className="btn active">{value.size}</div>
                                    :<div key={index} className="btn">{value.size}</div>
                                    }
                                </a>
                            ))}
                        </div>
                    </div>

                    

                    {/* {!isAdmin && <div className="checkPincode d-flex mt-3 mb-2">
                        <input name='pincode' type="text" placeholder='Enter pincode' value={inputs.pincode} onChange={handleChange} maxLength='6' />
                        {validatePincode(inputs.pincode) &&  <div className="btn" onClick={()=>{checkForPin(details.productId,inputs.pincode)}}>Check</div>}
                    </div>}
                    {availableForPincode==null && <div></div>}
                    {availableForPincode==true && <div className='font1' style={{color:'green'}}>Yes it is delevirable</div>}
                    {availableForPincode==false && <div className='font1' style={{color:'red'}}>Not deleverable to this pincode</div>} */}
                                    
                    {!isAdmin && <div className="btn rateProduct mt-4" onClick={showHide}>Rate Product</div>}
                    <div className="text-danger font1 mt-2" style={{display:cantRate}}>You can't rate as you have not ordered the product</div>
                    <div className="text-danger font1 mt-2" style={{display:alreadyRated}}>You have alrready reviewed the product</div>
                    <div className="font1 text-success mb-3" style={{display:reviewSuccess}}>Thnx for reviewing</div>
                    <div className="submitRating" style={{display:ratingBox}}>
                            <div className="font1 text-danger mb-3 text-center" style={{fontSize:13,display:reviewIncomplete}}>Fill your name ,comment  and rating</div>
                            <div className="font1 text-danger mb-3 text-center" style={{fontSize:13,display:reviewError}}>Error in reviewing . Please try after some time</div>
                            <div className="d-flex stars" >
                               {[...Array(5)].map((val,ind)=>(
                                    <div key={ind} onClick={(e)=>{ setInputs({...inputs,'rating':ind+1});}} className="d-flex align-items-center justify-content-center">
                                        <AiFillStar color={inputs.rating>=ind+1?'#df7d12':'gray'} />
                                    </div>
                               ))}
                            </div>
                        <input name="name" type="text" placeholder='Your name' value={inputs.name} onChange={handleChange} />
                        <textarea name='comment' placeholder='Enter comment' value={inputs.comment} onChange={handleChange}></textarea>
                        <div className="btn btn-secondary rateIt" onClick={rateIt}>Rate it</div>
                    </div>
                </div>
            </div>
            <div className="reviews mt-5">
                <div className="subHeading font1">All Reviews And Rating</div>
                {commentsArray.length>0
                ?commentsArray.map((user ,ind)=>(
                   <ReviewCard key={ind} name={user.userName} rating = {user.rating} comment={user.comment} />
                ))
                :<div className="font1 subHeading text-secondary">No reviews yet</div>
                }
            </div>
        </div>
    </div>
  )
}

export default ProductPage

// ₹