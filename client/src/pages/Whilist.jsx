import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux'


import ProductCard from '../components/ProductCard';
import Empty from '../components/Empty'
import Loading from '../components/Loading'




const Whilist = () => {

    let {userInfo,loading=true,status,myWhilist,isAdmin} = useSelector((state)=>state.userDetailsReducer);
    const navigate = useNavigate();
    useEffect(() => {
		if(!loading && status!==200){
            navigate('/login');
		}
	}, [loading])
    


  return (
      <div className='whilist'>
        {loading && <Loading />}
        <div className="my-2 container-fluid">
            <div className="overflow-hidden">
                <div className='d-flex flex-wrap align-items-center box'>  
                {status==200 && myWhilist.length==0 && <Empty />}
                {status==200 && [...userInfo.whilist].reverse().map((item,ind)=>(
                        myWhilist.map((product,index)=>(
                            item==product.productId && <ProductCard type='user' key={index} product={product} />
                        ))
                    ))
                }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Whilist