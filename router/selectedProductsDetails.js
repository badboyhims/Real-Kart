
const express = require('express');
const router = express.Router();


// getting the productSchema 
const Product = require('../schema/productSchema');





router.post("/api/selectedProductsDetails", async (req,res)=>{
    let {query} = req.body;
    try{
        const products = await Product.find(query);
        res.status(200).json({details:products});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }
})

module.exports = router