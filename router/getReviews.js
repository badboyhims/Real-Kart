
const express = require('express');
const router = express.Router();


// getting the productSchema 
const Review = require('../schema/reviewSchema');


router.post("/api/getReviews", async (req,res)=>{
    const {productName,productBrand} = req.body;
    try{
        const reviews = await Review.find({productName:productName,productBrand:productBrand});
        res.status(200).json({details:reviews});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }
})

module.exports = router