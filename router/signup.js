const express = require('express');
const router = express.Router();


// getting the userschema 
const User = require('../schema/userSchema');


router.post('/api/signup', async (req,res)=>{
    try{
        const {email,password,sendedOtp,otp} = req.body;
        if(!password || !otp){
            res.status(202).json({"message":"fill it completely"});
        }else if(sendedOtp != otp){
            res.status(203).json({message:"wrong otp"});
        }else{
            const newUser = new User({email,password});
            let token = await newUser.generateToken();
            res.cookie('userToken',token,{httpOnly:true});
            await newUser.save();
            res.status(201).json({message:"registered successfully"})
        }
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})




module.exports = router;