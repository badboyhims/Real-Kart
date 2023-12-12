export const userDetailsAction = ()=>{
    return async (dispatch)=>{
        try{

            dispatch({
                type:'userDetailsRequest'
            })

            const res = await fetch('/api/userDetails',{
                method:"GET",
                headers:{
                    Accept:"application/json",
                    "content-Type":"application/json"
                },
                Credential:'include'
            });
            const {data} = await res.json();
            if(res.status==200){
                dispatch({
                    type:'userDetailsSuccess',
                    payload:data
                })
            }else if(res.status==401){
                dispatch({
                    type:'userDetailsNotRegestered'
                })
            }else{
                dispatch({
                    type:'userDetailsFail',
                })
            }
        }catch(err){
            dispatch({
                type:'userDetailsFail',
            })
        }
    }
}

