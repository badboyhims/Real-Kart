
export const initialUserDetails = {};

const userDetailsReducer = (state = initialUserDetails,action)=>{
    if(action.type=='userDetailsRequest'){
        return {
            loading:true,
            data:state
        };
    }else if(action.type=='userDetailsSuccess'){
        return {
            loading:false,
            userInfo:action.payload.userInfo,
            myCart:action.payload.myCart,
            myWhilist:action.payload.myWhilist,
            orders:action.payload.orders,
            isAdmin:action.payload.userInfo.email==='admin@gmail.com'?true:false,
            status:200
        };
    }else if(action.type=='userDetailsFail'){
        return {
            loading:false,
        };
    }else if(action.type=='userDetailsNotRegestered'){
        return {
            loading:false,
            data:state,
            status:401
        };
    }else{
        return state
    }
}

export default userDetailsReducer