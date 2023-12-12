import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'

import {MdEmail} from 'react-icons/md'
import {RiLockPasswordFill} from 'react-icons/ri'
import {AiFillEye} from 'react-icons/ai'
import {AiFillEyeInvisible} from 'react-icons/ai'


import {LoginRequest} from '../apiCalls/LoginRequest'

import '../styles/account.css'
const Login = () => {

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
        email:"",password:""
    })
    let key,val;
    const handleChange = (e)=>{
        key = e.target.name;
        val = e.target.value;
        setInputs({...inputs,[key]:val});
    }

    const [incompleteError, setIncompleteError] = useState('none');
    const [wrongCredentials, setWrongCredentials] = useState('none');
    const [serverError, setServerError] = useState('none');

    const login = async ()=>{
        if(inputs.email=="" || inputs.password==""){
            setIncompleteError('block');
            setWrongCredentials('none');
            setServerError('none');
        }else{
            let res = await LoginRequest(inputs.email,inputs.password);
            if(res.status==200){
                console.log('regesterd');
                navigate('/');
                window.location.reload();
            }else if(res.status==404){
                setIncompleteError('none');
                setWrongCredentials('block');
                setServerError('none');
            }else{
                setIncompleteError('none');
                setWrongCredentials('none');
                setServerError('block');
            }
        }
    }

  return (
    <div className='account'>
        <div className="accountCard">
            <div className="font1 text-danger text-center mb-3" style={{display:incompleteError}}>Fill email and password</div>
            <div className="font1 text-danger text-center mb-3" style={{display:wrongCredentials}}>Password or email is incorrect</div>
            <div className="font1 text-danger text-center mb-3" style={{display:serverError}}>There is some problem in signing account please try after some time.</div>
                
            <div className="box">
                <div className="font1">Enter Mail Id</div>
                <div className="inputBox">
                    <div className="leftIcon"> <MdEmail /></div>
                    <input type="text" placeholder='Enter email' onChange={handleChange} name='email' value={inputs.email} />
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
                    <div className="font1 text-primary mt-1" style={{textAlign:'end',fontSize:14}}>
                        <Link to='/forgotPassword'>Forgot Password?</Link>
                    </div>
                </div>
            </div>
            <div className="btn bgColor w-100" style={{color:'white'}} onClick={login}>Log IN</div>
            <div className="d-flex justify-content-center mt-2">
                <div className="font1 me-2">New user ?</div>
                <Link to='/signup' className='font1 textColor'>Sign Up</Link>
            </div>
        </div>
    </div>
  )
}

export default Login