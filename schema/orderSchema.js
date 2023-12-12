const mongoose = require('mongoose');




// for products
const OrderSchema = new mongoose.Schema({ 
    orderId:{type:String},
    email:{type:String},
    time:{type:Number},
    cart:[{
        img:{type:String},
        productId:{type:String},
        brand:{type:String},
        name:{type:String},
        color:{type:String},
        size:{type:String},
        price:{type:String},
        qty:{type:Number},
    }],
    totalPrice:{type:Number},
    name:{type:String},
    pin:{type:String},
    phone:{type:String},
    address:{type:String},
    city:{type:String},
    state:{type:String},
    locality:{type:String},
    date:{type:String},
    time:{type:String},
    status:{type:String,default:"ordered"}
})



const Order = mongoose.model('ORDER',OrderSchema);

module.exports = Order;
