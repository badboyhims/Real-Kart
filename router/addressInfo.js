const express = require('express');
const router = express.Router();



// getting the userschema 
const User = require('../schema/userSchema');


router.post('/api/addressInfo', async (req,res)=>{
    try{
        const {email,name,phone,address,locality,city,pin,state} = req.body;
        const data = await User.findOneAndUpdate({email:email},{name:name,phone:phone,address:address,locality:locality,city:city,pin:pin,state:state});
        res.status(200).json({message:"success"});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})



module.exports = router;