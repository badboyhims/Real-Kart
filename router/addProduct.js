const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');


const stringToArray = (str)=>{
    let array=[];
    let curr="";
    let ascii;
    array.push(curr);
    for(let i=0;i<str.length;i++){
        ascii = str.charCodeAt(i);
        if(str[i]==' '){
            if(curr.length>0){
                array.push(curr);
                curr="";
            }
        }else if(ascii>=97 && ascii<=122){
            curr+=str[i];
        }
    }
    if(curr.length>0){
        array.push(curr);
    }
    return array;
}





// getting the productSchema 
const Product = require('../schema/productSchema');

// for getting image multer is used
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
})
  
// .single is used that we have single file of name   img 
const upload = multer({ storage: storage }).single('img');


router.post('/api/addProduct',upload,async (req,res)=>{
    try{
        // console.log(req.file)
        let {name,brand,category,occasion,color,gender,stock,price,actualPrice,description,pincodes,size,inTrending,specialOffer} = req.body;
       
        let img = req.file.filename;
        let imgType = req.file.mimetype;
        stock = parseInt(stock);
        price = parseInt(price);
        actualPrice = parseInt(actualPrice);
        color = color.toLowerCase();

        let productId = name.toLowerCase()+" "+brand.toLowerCase()+" "+color+" "+size;
        let discount = parseInt(((actualPrice-price)/actualPrice)*100);
        let tags = productId+" "+gender+" "+occasion+" "+category;
        tags = tags.toLowerCase();
        tags = stringToArray(tags);
        const productExist = await Product.findOne({productId:productId});
        if(productExist){
            fs.unlink(req.file.path,(err)=>{
                console.log(err);
                return;
            });
            res.status(205).json({exist:"this product already exist"});
        }else{
            const newProduct = new Product({productId,img,name,brand,gender,occasion,category,color,stock,discount,
                price,actualPrice,description,pincodes,size,inTrending,specialOffer,tags});
            await newProduct.save();
            res.status(200).json({added:"Product added successfully"});
        }
    }catch(err){
        fs.unlink(req.file.path,(err)=>{
            console.log(err);
            return;
        });
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})


module.exports = router;



