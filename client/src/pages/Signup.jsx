import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'

import {MdEmail} from 'react-icons/md'
import {RiLockPasswordFill} from 'react-icons/ri'
import {AiFillEye} from 'react-icons/ai'
import {AiFillEyeInvisible} from 'react-icons/ai'
import {IoIosTimer} from 'react-icons/io'


import { SendEmail } from '../apiCalls/SendEmail';
import { SignupRequest } from '../apiCalls/SignupRequest'


import '../styles/account.css'
const Signup = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStyle, setPasswordStyle] = useState('disc')
    const showOrHide = ()=>{
        if(showPassword){
            setShowPassword(false);
            setPasswordStyle('disc');
        }else{
            setShowPassword(true);
            setPasswordStyle('none');
        }
    }

    const [inputs, setInputs] = useState({
        email:"",password:"",otp:"",sendedOtp:"",
    })
    let key,val;
    const handleChange = (e)=>{
        key = e.target.name;
        val = e.target.value;
        setInputs({...inputs,[key]:val});
    }

    const [emailSection, setEmailSection] = useState(true);
    const [passwordSection, setPasswordSection] = useState(false);

    const [validEmailDisplay, setValidEmailDisplay] = useState('none');
    const [userExistError, setUserExistError] = useState('none');
    const [incompleteError, setIncompleteError] = useState('none');
    const [wrongOtpError, setWrongOtpError] = useState('none');
    const [serverError, setServerError] = useState('none');

    const sendOtp = async ()=>{
        if(!inputs.email.includes('@') || !inputs.email.includes('.')){
            setValidEmailDisplay('block');
        }else{
            setValidEmailDisplay('none');
            let res = await SendEmail(inputs.email,'signup');
            let data = await res.json();
            if(res.status==200){
                setInputs({...inputs,'sendedOtp':(data.otp).toString()});
                setPasswordSection(true);
                setEmailSection(false);
                setUserExistError('none');
                setServerError('none');
            }else if(res.status==422){
                setUserExistError('block');
                setServerError('none');
            }else{
                setUserExistError('none');
                setServerError('block');
            }
            
           
        }
    }

    const register = async ()=>{
        let res = await SignupRequest(inputs.email,inputs.password,inputs.sendedOtp,inputs.otp);
        if(res.status==201){
            console.log('regesterd');
            navigate('/');
            window.location.reload();
        }else if(res.status==202){
            setIncompleteError('block');
            setWrongOtpError('none');
            setServerError('none');
        }else if(res.status==203){
            setIncompleteError('none');
            setWrongOtpError('block');
            setServerError('none');
        }else{
            setIncompleteError('none');
            setWrongOtpError('none');
            setServerError('block');
        }
    }

    const resetEmail = ()=>{
        setPasswordSection(false);
        setEmailSection(true);
    }

  return (


    <div className='account'>
        <div className="accountCard">
            {emailSection &&
                <>
                    <div className="font1 text-danger text-center mb-3" style={{display:userExistError}}>
                        This email id already exist.
                    </div>
                    <div className="font1 text-danger text-center mb-3" style={{display:serverError}}>
                        There is some problem in sending otp. Please try after some time.
                    </div>

                    <div className="box">
                        <div className="font1">Enter Mail Id</div>
                        <div className="inputBox">
                            <div className="leftIcon"> <MdEmail /></div>
                            <input onChange={handleChange} name='email' value={inputs.email} type="text" placeholder='Enter email' />
                            <div className='text-danger' style={{fontSize:12,display:validEmailDisplay}}>Please fill valid email id</div>
                        </div>
                    </div>
                    <div className="btn bgColor w-100" style={{color:'white'}} onClick={sendOtp}>Send OTP</div>
                    <div className="d-flex justify-content-center mt-2">
                        <div className="font1 me-2">Existing user ?</div>
                        <Link to='/login' className='font1 textColor'>Log IN</Link>
                    </div>
                </>
            }   

            {passwordSection &&
                <>
                <div className="font1 text-danger text-center mb-3" style={{display:incompleteError}}>It is important to fill password and otp</div>
                <div className="font1 text-danger text-center mb-3" style={{display:serverError}}>There is some problem in regestering account please try after some time.</div>
                <div className="font1 text-danger text-center mb-3" style={{display:wrongOtpError}}>Wrong OTP</div>
                <div className="font1">Email</div>
                <div className="d-flex font1">
                    <div style={{color:'gray'}}>{inputs.email}</div>
                    <div className="textColor ms-2" style={{cursor:'pointer'}} onClick={resetEmail}>Change</div>
                </div>
                <div className="box">
                    <div className="font1">Enter OTP</div>
                    <div className="inputBox">
                        <div className="leftIcon"> <IoIosTimer /></div>
                        <input onChange={handleChange} name='otp' value={inputs.otp} type='text' placeholder='Enter OTP' />
                    </div>
                </div>
                <div className="box">
                    <div className="font1">Enter Password</div>
                    <div className="inputBox">
                        <div className="leftIcon"> <RiLockPasswordFill /></div>
                        <input style={{WebkitTextSecurity:passwordStyle}} onChange={handleChange} name='password' value={inputs.password} type="text" placeholder='Enter password' />
                        <div className="rightIcon" onClick={showOrHide}>
                            {showPassword?<AiFillEye />:<AiFillEyeInvisible />}
                        </div>
                    </div>
                </div>
                <div className="btn bgColor w-100" style={{color:'white'}} onClick={register}>Create Account</div>
                </>
            }
        </div>
    </div>
  )
}

export default Signup