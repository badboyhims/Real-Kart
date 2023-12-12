import React,{useState,useRef,useEffect} from 'react'
import {Link,useNavigate} from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import  AlertBox from '../components/AlertBox'

// importing css files 
import { Card} from 'react-bootstrap';



import {AiFillHeart} from 'react-icons/ai'
import {AiFillDelete} from 'react-icons/ai'
import {HiPencil} from 'react-icons/hi'

import { AddToWhilist } from '../apiCalls/AddToWhilist';

import { userDetailsAction } from '../actions/userDetails';

const ProductCard = ({product,type,deleteProduct,orderedDate}) => {

    const like = useRef();
    const [add, setAdd] = useState(true);

    let {loading,status,userInfo,isAdmin} = useSelector((state)=>state.userDetailsReducer);
    const [email, setEmail] = useState("");
    const [error, setError] = useState('none');
    const [successToAddToWhilist, setSuccessToAddToWhilist] = useState('none');
    const [successToRemoveToWhilist, setSuccessToRemoveToWhilist] = useState('none');

    // loading data from redux function
    const dispatch = useDispatch();
    const loadAllData = ()=>{
        dispatch(userDetailsAction());
    }

    useEffect(() => {
        if(!loading && status==200 && !isAdmin){
            setEmail(userInfo.email);
            if(userInfo.whilist.includes(product.productId)){
                like.current.classList.add('liked');
                setAdd(false);
            }else{
                like.current.classList.remove('liked');
                setAdd(true);
            }
        }
    }, [loading])



    const navigate = useNavigate();
    // adding to whilist 
    const addToWhilist = async (e)=>{
        e.stopPropagation();
        e.preventDefault();
        if(status!=200){
            navigate('/login');
        }else{
            const res =  await AddToWhilist(email,product.productId,add);
            if(add){
                like.current.classList.add('liked');
            }else{
                like.current.classList.remove('liked');
            }

            if(res.status==200){
                if(add){
                    setSuccessToAddToWhilist('flex');
                    setTimeout(() => {
                        setSuccessToAddToWhilist('none');
                    }, 2000);
                }else{
                    setSuccessToRemoveToWhilist('flex');
                    setTimeout(() => {
                        setSuccessToRemoveToWhilist('none');
                    }, 2000);
                }
            }else{
                setError('flex');
                setTimeout(() => {
                    setError('none');
                }, 2000);
            }
            loadAllData();
        }
    }

  return (
    <Link to={'/product?name='+product.name+'&brand='+product.brand+'&color='+product.color+'&size='+product.size} className="productCardLink">
        <AlertBox content="successfully added to whilist" status="200" display={successToAddToWhilist} />
        <AlertBox content="successfully remove from whilist" status="200" display={successToRemoveToWhilist} />
        <AlertBox content="Some error. Please try after some time" status="500" display={error} />
        <Card className="productCard">
            {isAdmin && type=='admin' && <div className="icons" onClick={(e)=>{e.stopPropagation();e.preventDefault();}}>
                    <Link to={'/edit/'+product.productId} className="icon1 edit">
                        <HiPencil />
                    </Link>
                    <div className="icon2 mt-1 delete" onClick={()=>{deleteProduct(product.productId)}}>
                        <AiFillDelete />
                    </div> 
                </div>
            }
            {!isAdmin && type=='user' &&
                <div className="icons" onClick={addToWhilist}>
                    <div ref={like} className="icon2 mt-1">
                        <AiFillHeart />
                    </div> 
                </div>
            }
            {isAdmin && type=='admin' && 
                <div className="stockAndSize">
                    <div className='bgColor'>{product.size}</div>
                    <div className="stock" style={{background:'gray',marginLeft:3}}>{product.stock}</div>
                </div>
            }

            <Card.Img variant="top" src={product.img} />
            <Card.Body>
                <Card.Title>
                    <div className="font1 brand">{product.brand}</div>
                </Card.Title>
                <Card.Text>
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
                    {!orderedDate && product.stock==0 && <div className="text-danger" style={{fontSize:12}}>Out of stock</div>}
                    {orderedDate && <div className="text-danger" style={{fontSize:12}}>On {orderedDate}</div>}
                </Card.Text>
            </Card.Body>
        </Card>
    </Link>
  )
}

export default ProductCard


