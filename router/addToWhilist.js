const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');



// getting the userschema 
const User = require('../schema/userSchema');


router.post('/api/addToWhilist', async (req,res)=>{
    try{
        const {email,productId,add} = req.body;
        if(add){
            const data = await User.findOneAndUpdate({email:email},{$push:{whilist:productId}});
            return res.status(200).json({data:data});
        }else{
            const data = await User.findOneAndUpdate({email:email},{$pull:{whilist:productId}});
            return res.status(200).json({data:data});
        }        
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})



module.exports = router;