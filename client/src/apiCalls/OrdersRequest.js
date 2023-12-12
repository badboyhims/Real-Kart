
export const OrdersRequest = async(details)=>{
    try{
        const res = await fetch('/api/order',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({details})
        });
        return res;
    }catch(err){
        console.log(err);
    }
}