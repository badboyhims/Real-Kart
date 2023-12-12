import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux'


// import css files 
import '../styles/addEditProducts.css'
import {Alert} from 'react-bootstrap'

import { AddressInfoRequest } from '../apiCalls/AddressInfoRequest';
import { userDetailsAction } from '../actions/userDetails';


const AddressInfo = () => {
    let {loading=true,status,userInfo,isAdmin} = useSelector((state)=>state.userDetailsReducer);
    const navigate = useNavigate();

     // loading data from redux function
     const dispatch = useDispatch();
     const loadAllData = ()=>{
         dispatch(userDetailsAction());
     }

    const [incompleteAlert, setIncompleteAlert] = useState('none');
    const [errorAlert, setErrorAlert] = useState('none');

    // values of all input tags using usestate
    const [inputs, setInputs] = useState({
		address:"",locality:"",city:"",state:"",pin:"",name:"",phone:""
    })
    // updating values of all inputs tags 
    let key,val;
    const handleChange = (e)=>{
        key = e.target.name;
        val = e.target.value;
        setInputs({...inputs,[key]:val});
    }

    useEffect(() => {
        if(!loading && status==200 && !isAdmin){
            setInputs({
                address:userInfo.address,locality:userInfo.locality,city:userInfo.city,
                state:userInfo.state,pin:userInfo.pin,phone:userInfo.phone,name:userInfo.name
            })
        }else if(!loading && status !=200){
            navigate('/login');
        }
    }, [loading])
    

   
    // sending data to backend 
    const [phoneValidateError, setPhoneValidateError] = useState('none');
    const [pinValidateError, setPinValidateError] = useState('none');

    function validate(str,n){
        let j;
        if(str.length ==n){
            for(let i=0;i<n;i++){
                j = str.charCodeAt(i);
                if(j<48 || j>57){
                    return false;
                }
            }
            return true;
        }
        return false;
    }


    const saveAddress = async()=>{
        if(!validate(inputs.phone,10)){
            setPhoneValidateError('block');
            return;
        }else{
            setPhoneValidateError('none');
        }

        if(!validate(inputs.pin,6)){
            setPinValidateError('block');
            return;
        }else{
            setPinValidateError('none');
        }

        if(!inputs.address || !inputs.name || !inputs.locality || !inputs.state || !inputs.city){
            setIncompleteAlert('block');
        }else{
            setIncompleteAlert('none');
            const res = await AddressInfoRequest(userInfo.email,inputs.name,inputs.phone,inputs.address,inputs.locality,inputs.city,inputs.pin,inputs.state);
            if(res.status==200){
                if(sessionStorage.getItem('orderCart')){
                    navigate('/payment');
                }else{
                    navigate('/success?message=your address has been saved successfully')
                }
                loadAllData();
            }else{
                setErrorAlert('block');
            }
        }
    }
   

  return (
    <div className='form' id='AddressInfo'>
        {/* alerts  */}
        <Alert style={{display:incompleteAlert}} onClose={() => setIncompleteAlert('none')} dismissible>
            <Alert.Heading className='font1'>Incomplete!</Alert.Heading>
            <p>It is necessray to fill all the details</p>
        </Alert>
        <Alert style={{display:errorAlert}} onClose={() => setErrorAlert('none')} dismissible>
            <Alert.Heading className='font1'>Server Error!</Alert.Heading>
            <p>There is some problem . Please try after some time.</p>
        </Alert>


        <div className="container">
            <div className="heading font1 textColor">Delivery Address</div>
        </div>
        <div className="container d-flex flex-wrap justify-content-between mt-4">
            <div className="w-100 d-flex inputBox">
                <div className="font1">Address</div>
                <input type="text"  name='address' onChange={handleChange} value={inputs.address} />
            </div>
            <div className="d-flex inputBox">
                <div className="font1">Locality</div>
                <input type="text"  name='locality' onChange={handleChange} value={inputs.locality} />
            </div>
            <div className="d-flex inputBox">
                <div className="font1">Pin Code</div>
                <input type="text" name='pin'  onChange={handleChange} value={inputs.pin} maxLength='6' />
                <div className="text-danger" style={{fontSize:12,display:pinValidateError}}>Enter valid pin code</div>
            </div>
           
            <div className="d-flex inputBox">
                <div className="font1">City/District/Town</div>
                <input type="text" name='city' onChange={handleChange} value={inputs.city} />
            </div>
            <div className="d-flex inputBox">
                <div className="font1">State</div>
                <input type="text" name='state' onChange={handleChange} value={inputs.state} />
            </div>
            <div className="d-flex inputBox">
                <div className="font1">Name</div>
                <input type="text" name='name' onChange={handleChange} value={inputs.name} />
            </div>
            <div className="d-flex inputBox">
                <div className="font1">Phone Number</div>
                <input type="text" name='phone' onChange={handleChange} value={inputs.phone} maxLength='10' />
                <div className="text-danger" style={{fontSize:12,display:phoneValidateError}}>Enter validphone number</div>
            </div>
            
            <div className="btn w-100" onClick={saveAddress} >Save Address</div>
        </div>
    </div>
  )
}

export default AddressInfo