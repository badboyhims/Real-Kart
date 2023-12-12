const express = require('express');
const router = express.Router();



// getting the userschema 
const Order = require('../schema/orderSchema');


router.post('/api/deliverProduct', async (req,res)=>{
    try{
        const {date,time,email} = req.body;
        const data = await Order.findOneAndUpdate({email:email,date:date,time:time},{status:'delivered'});
        res.status(200).json({message:"successful"});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})



module.exports = router;