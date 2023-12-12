const express = require('express');
const router = express.Router();


// getting the userschema 
const Order = require('../schema/orderSchema');


router.post('/api/allOrders', async (req,res)=>{
    try{
        let {filters} = req.body;

        let orders = await Order.find(filters);
        orders.reverse();

        res.status(200).json({orders:orders});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})




module.exports = router;