const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// getting the userschema 
const User = require('../schema/userSchema');

let myEmail = process.env.MY_EMAIL
let myPassword = process.env.MY_APP_PASSWORD
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: myEmail,
        pass: myPassword
    }
});
  

function sendEmail(email,text,subject){
    var mailOptions = {
        from: myEmail,
        to: email,
        subject:subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else{
            console.log(info.response);
        }
    });
}


const makeOtp = ()=>{
    let otp = Math.random();
    otp = 1000+ (otp*9000);
    otp = Math.floor(otp);
    return otp;
}

router.post('/api/sendEmail', async (req,res)=>{
    try{
        const {email,type} = req.body;
        if(type=='signup'){
            const userExist = await User.findOne({email:email});
            if(userExist){
                res.status(422).json({message:'this user alredy exist'})
            }else{
                const otp = makeOtp();
                let text = "your otp for regestring with trenders is " + otp;
                let subject = 'OTP for regestring with trenders';
                sendEmail(email,text,subject);
                res.status(200).json({otp:otp});
            }
        }else{
            // for forget password 

            const userExist = await User.findOne({email:email});
            if(!userExist){
                res.status(422).json({message:'this id is never logged before'})
            }else{
                const otp = makeOtp();
                let text = "your otp to change yor password is " + otp;
                let subject = 'OTP for settingn new password on trenders';
                sendEmail(email,text,subject);
                res.status(200).json({otp:otp});
            }
        }
    }catch(err){
        res.status(500).json({error:"there is error and we are not getting req.body"});
        console.log(err)
    }

})




module.exports = router;