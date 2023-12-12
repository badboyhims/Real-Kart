
const express = require('express');
const router = express.Router();
const fs = require('fs');


// getting the productSchema 
const Product = require('../schema/productSchema');


router.post("/api/deleteProduct", async (req,res)=>{
    const {productId} = req.body;
    try{
        let product = await Product.findOne({productId:productId});
        product = product.img;
        // console.log(product);
        await Product.deleteOne({productId:productId});
        fs.unlink('public//'+product,(err)=>{
            console.log(err);
            return;
        });
        res.status(200).json({deleted:"successfully  deleted"});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }
})

module.exports = router