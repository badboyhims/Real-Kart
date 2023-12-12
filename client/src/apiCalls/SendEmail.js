export const SendEmail = async(email,type)=>{
    try{
        const res = await fetch('/api/sendEmail',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                email:email,type:type
            })
        });
        let data = await res;
        return data;
    }catch(err){
        console.log(err);
    }
}