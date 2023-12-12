const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// getting the userschema 
const User = require('../schema/userSchema');
const Product = require('../schema/productSchema');
const Order = require('../schema/orderSchema');


// to get onlu product ids array out of ids and qty 
const findProductId = (cart)=>{
    let idsArray = [];
    for(let item in cart){
        idsArray.push(cart[item].productId)
    }
    return idsArray;
}


router.get('/api/userDetails', async (req,res)=>{
    try{
        let token = req.cookies.userToken
        if(!token){
            res.status(401).json({data:"not regestered"});
        }else{
            const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
            let userInfo = await User.findOne({_id:verifyToken._id,token:token});
            const cartArray = findProductId(userInfo.cart);
            let whilistArray = userInfo.whilist;
            let myWhilist = await Product.find({productId:{$in:whilistArray}});
            let myCart = await Product.find({productId:{$in:cartArray}});
            let orders = await Order.find({email:userInfo.email});
            
            myWhilist.reverse();
            myCart.reverse();
            orders.reverse();
            
            if(!userInfo){
                res.status(401).json({data:"not regestered"});
            }else{
                res.status(200).json({data:{userInfo:userInfo,myCart:myCart,myWhilist:myWhilist,orders:orders}});
            }
        }    
    }catch(err){
        res.status(500).json({data:"there is error and we are not getting try block"});
        console.log(err)
    }

})




module.exports = router;