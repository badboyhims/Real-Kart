const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');



// getting the userschema 
const User = require('../schema/userSchema');
const Product = require('../schema/productSchema');


router.post('/api/addToCart', async (req,res)=>{
    try{
        const {email,productId,add,qty,type} = req.body;
        if(add){
            let data;
            if(type=='add'){
                const productDetails  = await Product.find({productId:productId});
                let actualPrice = productDetails[0].actualPrice;
                let price = productDetails[0].price;
                const details= {productId,qty,price,actualPrice};
                data = await User.findOneAndUpdate({email:email},{$push:{cart:details}});
            }else{
                data = await User.findOneAndUpdate({email:email,'cart.productId':`${productId}`},{$set:{'cart.$.qty':qty}});
            }
            return res.status(200).json({data:data});
        }else{
            const data = await User.findOneAndUpdate({email:email},{$pull:{cart:{productId:productId}}});
            return res.status(200).json({data:data});
        }        
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})



module.exports = router;

