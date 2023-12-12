const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,  
    key_secret: process.env.RAZORPAY_KEY_SECRET,  
});




  
router.post('/api/generateOrderId', async (req,res)=>{
    try{
        const {amount} = req.body;
        const options = {
            amount: (amount*100).toString(),
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        res.status(200).json({order:order});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})



module.exports = router;