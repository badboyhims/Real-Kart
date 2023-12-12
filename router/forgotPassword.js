const express = require('express');
const Product = require('../schema/productSchema');
const router = express.Router();
const bcrypt = require('bcryptjs')


// getting the userschema 
const User = require('../schema/userSchema');


router.post('/api/forgotPassword', async (req,res)=>{
    try{
        let {email,password,sendedOtp,otp} = req.body;
        if(!password || !otp){
            res.status(202).json({"message":"fill it completely"});
        }else if(sendedOtp != otp){
            res.status(203).json({message:"wrong otp"});
        }else{
            password = await bcrypt.hash(password,12);
            const data = await User.findOneAndUpdate({email:email},{$set:{password:password}});
            res.status(200).json({message:data});
        }
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})




module.exports = router;