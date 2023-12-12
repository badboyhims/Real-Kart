const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');



// getting the userschema 
const User = require('../schema/userSchema');


router.post('/api/login', async (req,res)=>{
    try{
        const {email,password} = req.body;
        const userExist = await User.findOne({email:email});
        if(userExist){
            const isMatch = await bcrypt.compare(password,userExist.password);
            if(isMatch){
                let token = await userExist.generateToken();
                res.cookie('userToken',token,{
                    httpOnly:true
                });
                res.status(200).json({message:'Sign In successfully'});
            }else{
                res.status(404).json({message:"password or username is incorrect"});
            }
            
        }else{
            res.status(404).json({message:"password or username is incorrect"});
        }
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})



module.exports = router;