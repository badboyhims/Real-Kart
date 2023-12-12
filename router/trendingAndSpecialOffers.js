const express = require('express');
const router = express.Router();


// getting the productchema 
const Product = require('../schema/productSchema');


router.get('/api/inTrendingAndSpecialOffers', async (req,res)=>{
    try{
        let specialOffers = await Product.find({specialOffer:true}); 
        let inTrendings = await Product.find({inTrending:true});
        specialOffers.reverse();
        inTrendings.reverse();

       res.status(200).json({data:{specialOffers:specialOffers,inTrendings:inTrendings}});
    }catch(err){
        res.status(500).json({data:"there is error and we are not getting try block"});
        console.log(err)
    }

})




module.exports = router;