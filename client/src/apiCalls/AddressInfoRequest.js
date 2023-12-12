export const AddressInfoRequest = async(email,name,phone,address,locality,city,pin,state)=>{
    try{
        const res = await fetch('/api/addressInfo',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({email,name,phone,address,locality,city,pin,state})
        });
        return res;
    }catch(err){
        console.log(err);
    }
}