import React,{useState,useEffect} from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';



// import css files 
import '../styles/addEditProducts.css'
import {Alert} from 'react-bootstrap'

import Loading from '../components/Loading'


import { SelectedProductsDetails } from '../apiCalls/SelectedProductsDetails';



const EditProducts = () => {    

    let {loading=true,status,isAdmin} = useSelector((state)=>state.userDetailsReducer);
    const navigate = useNavigate();

    // for all alerts 
    const [incompleteAlert, setIncompleteAlert] = useState('none');
    const [imgTypeAlert, setImgTypeAlert] = useState('none');
    const [errorAlert, setErrorAlert] = useState('none');
    const [loader, setLoader] = useState(false);

    const [isDataFetched, setIsDataFetched] = useState(false);

    // values of all input tags using usestate
    const [inputs, setInputs] = useState({
        productId:"",name:"",brand:"",color:"",size:"",img:"",description:"",price:"",actualPrice:"",pincodes:"",stock:"",specialOffer:false,inTrending:false
    })

    const {id} = useParams();
    let data;
    useEffect(() => {
        async function fetchData(){
            const query = {productId:id};
            data = await SelectedProductsDetails(query);
            data = data[0];
            setInputs({
                productId:data.productId,name:data.name,brand:data.brand,color:data.color,size:data.size,
                description:data.description,price:data.price,actualPrice:data.actualPrice,
                pincodes:data.pincodes,stock:data.stock,inTrending:data.inTrending,specialOffer:data.specialOffer
            });
            setIsDataFetched(true);
        }
        if(!loading && status==200 && isAdmin){
            fetchData();
        }else if(!loading && (status != 200 || !isAdmin)){
            navigate('/login');
        }
    }, [loading])
  

    // updating values of all inputs tags 
    let key,val,check;
    const handleChange = (e)=>{
        key = e.target.name;
        val = e.target.value;
        check = e.target.checked;
        console.log(typeof(check),check,key);
        if(key=='inTrending' || key=='specialOffer'){
            setInputs({...inputs,[key]:check});
        }else{
            setInputs({...inputs,[key]:val});
        }
    }

    // updating the image uploaded 
    const uploadImage = (e)=>{
        val = e.target.files[0];
        setInputs({...inputs,'img':val});
    }
    function checkImgType(imgType){
        if(inputs.img.type == "image/jpeg" || inputs.img.type == "image/jpg" || inputs.img.type == "image/png" || inputs.img.type == "image/gif"){
            return true;
        }
        return false;
    }
    // sending data to backend 
    const sendData = async ()=>{
        try{
            if(!inputs.stock || !inputs.price || !inputs.actualPrice || !inputs.description || !inputs.pincodes){
                setImgTypeAlert('none');
                setIncompleteAlert('block');
                setErrorAlert('none')
            }else{
                if((inputs.img && checkImgType(inputs.img.type)) || (!inputs.img)){
                    const url = '/api/editProduct';
                    let formdata = new FormData();
                    if(inputs.img != undefined){
                        formdata.append('img',inputs.img,inputs.img.name);
                    }
                    formdata.append('productId',inputs.productId);
                    formdata.append('stock',inputs.stock);
                    formdata.append('price',inputs.price);
                    formdata.append('actualPrice',inputs.actualPrice);
                    formdata.append('description',inputs.description);
                    formdata.append('pincodes',inputs.pincodes);
                    formdata.append('specialOffer',inputs.specialOffer);
                    formdata.append('inTrending',inputs.inTrending);
                    setLoader(true);
                    let res = await axios.post(url,formdata);
                    if(res.status==200){
                        setLoader(false);
                        navigate('/success?message=your product is edited successfully');
                    }else{
                        setLoader(false);
                        setImgTypeAlert('none');
                        setIncompleteAlert('none');
                        setErrorAlert('block')
                    }           
                }else{
                    setImgTypeAlert('block');
                    setIncompleteAlert('none');
                    setErrorAlert('none')
                }
            }
        }catch(err){
            setImgTypeAlert('none');
            setIncompleteAlert('none');
            setErrorAlert('block')
        }
    }

  return (
    <div id='addEditProducts' className='form'>

        {loader && <Loading />}

        {/* alerts  */}
        <Alert style={{display:incompleteAlert}} onClose={() => setIncompleteAlert('none')} dismissible>
            <Alert.Heading className='font1'>Incomplete!</Alert.Heading>
            <p>Only image  box can be left emptied</p>
        </Alert>
        <Alert style={{display:imgTypeAlert}} onClose={() => setImgTypeAlert('none')} dismissible>
            <Alert.Heading className='font1'>Image error!</Alert.Heading>
            <p>image should be of type jpg or jpeg or png or gif</p>
        </Alert>
        <Alert style={{display:errorAlert}} onClose={() => setErrorAlert('none')} dismissible>
            <Alert.Heading className='font1'>Server Error!</Alert.Heading>
            <p>There is some problem to add product . Please try after some time.</p>
        </Alert>

        {!isDataFetched
        ?<div className="font1 textColor heading container">Loading Data ....</div>
        :<div className="container d-flex flex-wrap justify-content-between mt-2">
            <div className="d-flex flex-column my-4 ">
                <div className="heading font1 textColor">{inputs.brand}</div>
                <div className="subHeading font1" style={{color:'gray'}}>{inputs.name}</div>
                <div className="font1 mt-2" style={{color:'gray'}}>Color:{inputs.color} , Size:{inputs.size}</div>
            </div>
            <div className="d-flex align-items-center justify-content-between" id='smallInputs'>
                <div className="d-flex inputBox">
                    <div className="font1">Stock</div>
                    <input type="number" placeholder='eg . 3' name='stock' onChange={handleChange} value={inputs.stock} />
                </div>
                <div className="d-flex inputBox">
                    <div className="font1">MRP of product(₹)</div>
                    <input type="number" placeholder='100' name='actualPrice' onChange={handleChange} value={inputs.actualPrice} />
                </div>
                <div className="d-flex inputBox">
                    <div className="font1">Discounted Price(₹)</div>
                    <input type="number" placeholder='if not discount same as actual price' name='price' onChange={handleChange} value={inputs.price} />
                </div>
            </div>
            <div className="d-flex flex-column w-100">
                <div className="font1">Desscription of product</div>
                <textarea name='description' placeholder='description and specs' onChange={handleChange} value={inputs.description}></textarea>
            </div>
           
            <div className="d-flex d-flex flex-column w-100">
                <div className="font1">Pincodes to which is deliverable</div>
                <textarea name='pincodes' placeholder=" eg. 123401 482005 123421" onChange={handleChange} value={inputs.pincodes}></textarea>
            </div>

            <div className="d-flex w-100 flex-column mt-3">
                <div className="font1">Update Image</div>
                <i className='textColor' style={{fontSize:'12px'}}>if dont't want to update then don't upload any other image</i>
                <input name='img' type="file" onChange={uploadImage} />
            </div>

            <div className="d-flex checkParentBox font1">
                <div className="checkBox">
                    <input type="checkbox" name='inTrending' checked={inputs.inTrending} onChange={handleChange}/>
                    <div className='mt-1 ms-1'>In Trending</div>
                </div>
                <div className="checkBox">
                    <input type="checkbox" name='specialOffer' checked={inputs.specialOffer} onChange={handleChange}/>
                    <div className='mt-1 ms-1'>Special Offers</div>
                </div>
            </div>
            <div className="btn w-100" onClick={sendData} >Save Changes</div>
        </div>
        }
    </div>
  )
}

export default EditProducts