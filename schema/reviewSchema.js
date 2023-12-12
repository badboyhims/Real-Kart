const mongoose = require('mongoose');



// for products reviews 
const reviewSchema = new mongoose.Schema({ 
   productName:{type:String,required:true},
   productBrand:{type:String,required:true},
   userName:{type:String,required:true},
   email:{type:String,required:true},
   comment:{type:String,required:true},
   rating:{type:Number,required:true},
})



const Review = mongoose.model('REVIEW',reviewSchema);

module.exports = Review;
