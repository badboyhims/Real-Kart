
export const GetAllOrdersForAdmin = async (filters)=>{
    try{
        const res = await fetch('/api/allOrders',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({filters})
        })
        const {orders} = await res.json();
        return orders;
    }catch(err){
        console.log(err);
    }
    
}