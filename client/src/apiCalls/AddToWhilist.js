export const AddToWhilist = async(email,productId,add)=>{
    try{
        const res = await fetch('/api/addToWhilist',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                email:email,productId:productId,add:add
            })
        });
       return res;
    }catch(err){
        console.log(err);
    }
}