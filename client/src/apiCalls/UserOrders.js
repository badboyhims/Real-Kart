export const UserOrdersCall = async(email)=>{
    try{
        const res = await fetch('/api/userOrders',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                email:email
            })
        });
        return res;
    }catch(err){
        console.log(err);
    }
}