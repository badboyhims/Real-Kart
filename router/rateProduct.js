const express = require('express');
const router = express.Router();


// getting the userschema 
const Review = require('../schema/reviewSchema');
const Product = require('../schema/productSchema');


router.post('/api/rateProduct', async (req,res)=>{
    try{
        const {email,productName,productBrand,userName,comment,rating} = req.body;
        const newReview = new Review({email,productName,productBrand,userName,comment,rating});
        await newReview.save();

        const reviews = await Review.find({productName:productName,productBrand:productBrand});
        const product = await Product.find({name:productName,brand:productBrand});

        let newRating = (rating+product[0].rating)/(reviews.length+1);
        await Product.updateMany({name:productName,brand:productBrand},{rating:newRating})
        res.status(200).json({message:"reviewed successfully"})
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})




module.exports = router;