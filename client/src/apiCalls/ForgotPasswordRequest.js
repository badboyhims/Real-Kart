
export const ForgotPasswordRequest = async(email,password,sendedOtp,otp)=>{
    try{
        const res = await fetch('/api/forgotPassword',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                email:email,password:password,sendedOtp:sendedOtp,otp:otp
            })
        });
        let data = await res;
        return data;
    }catch(err){
        console.log(err);
    }
}