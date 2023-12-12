const mongoose = require('mongoose');



// for products
const ProductSchema = new mongoose.Schema({ 
   img:{type:String},
   productId:{type:String},
   name:{type:String},
   brand:{type:String},
   gender:{type:String},
   occasion:{type:String},
   category:{type:String},
   color:{type:String},
   tags:[{type:String}],
   rating:{type:Number,default:0},
   stock:{type:Number,default:1},
   price:{type:Number,default:0},
   actualPrice:{type:Number,default:0},
   discount:{type:Number,default:0},
   description:{type:String},
   pincodes:{type:String},
   size:{type:String},
   inTrending:{type:Boolean,default:false},
   specialOffer:{type:Boolean,default:false},
})



const Product = mongoose.model('PRODUCT',ProductSchema);

module.exports = Product;
