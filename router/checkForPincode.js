
const express = require('express');
const router = express.Router();



// getting the productSchema 
const Product = require('../schema/productSchema');


router.post("/api/checkForPincode", async (req,res)=>{
    const {productId,pin} = req.body;
    let check=false;
    try{
        // const products = await Product.find({productId:productId,pincodes:{$regex:pin}});
        const products = await Product.find({productId:productId,pincodes:{$regex:pin}});
        if(products.length >0){
            check = true;
        }
        res.status(200).json({'check':check});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }
})

module.exports = router