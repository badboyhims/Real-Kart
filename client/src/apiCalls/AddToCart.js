export const AddToCart = async(email,productId,add,qty,type)=>{
    try{
        const res = await fetch('/api/addToCart',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                email:email,productId:productId,add:add,qty:qty,type:type
            })
        });
       return res
    }catch(err){
        console.log(err);
    }
}