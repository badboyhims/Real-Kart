
const express = require('express');
const router = express.Router();

// function to make array of searched input 


const stringToArray = (str,arrayReg,arrayStr)=>{
    let curr="";
    let ascii;
    for(let i=0;i<str.length;i++){
        ascii = str.charCodeAt(i);
        if(str[i]==' '){
            if(curr.length>0){
                arrayStr.push(curr);
                curr = new RegExp(curr);
                arrayReg.push(curr);
                curr="";
            }
        }else if(ascii>=97 && ascii<=122){
            curr+=str[i];
        }
    }
    if(curr.length>0){
        arrayStr.push(curr);
        curr = new RegExp(curr);
        arrayReg.push(curr);
    }
    if(arrayStr.length==0){
        arrayStr.push("");
    }
}





// getting the productSchema 
const Product = require('../schema/productSchema');


router.post("/api/getSearchedProducts", async (req,res)=>{
    let arrayReg=[];
    let arrayStr= [];
    try{
        let {search,filterData,type} = req.body;
        if(search){
            search = search.toLowerCase();
        }

       
        stringToArray(search,arrayReg,arrayStr);
        let products = await Product.find({tags:{$all:arrayStr}});
        if(products.length ==0){
            products = await Product.find({tags:{$all:arrayReg}});
        }
        if(products.length==0){
            products = await Product.find({tags:{$in:arrayStr}});
        }
        if(products.length==0){
            products = await Product.find({tags:{$in:arrayReg}});
        }

        let didntEexist=true,common;
        let nameBrandArray = [];
        let brandAndName;
        if(!filterData){
            filterData = {};
        }
        let filterProducts = await Product.find(filterData);
        products = products.filter((item1) => {
            common = filterProducts.some(item2 => item1.id === item2.id);
            brandAndName = item1.brand + item1.name;
            if(type=='user'){
                if(nameBrandArray.includes(brandAndName)){
                    didntEexist = false;
                }else{
                    didntEexist = true;
                    nameBrandArray.push(brandAndName);
                }
            }
            return common && didntEexist
        });

        
        products.reverse();
        res.status(200).json({productsArray:products});
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }
})

module.exports = router
