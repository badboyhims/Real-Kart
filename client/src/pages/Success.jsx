import React from 'react'
import { Link } from 'react-router-dom'

const Success = () => {
  const message = new URLSearchParams(window.location.search).get('message');
  return (
    <div id='success' style={{minHeight:"90vh"}} className="d-flex align-items-center justify-content-center flex-column">
        <img style={{opacity: 0.7,filter: 'brightness(0.9)'}} src="/images/success.png" alt="" />
        <div className="font1 text-secondary heading text-center">
            {message?message:"Task is done successfully"}
        </div>
        <Link to='/' className="btn bgColor mt-2" style={{color:"white"}}>Back To Home</Link>
    </div>
  )
}

export default Success