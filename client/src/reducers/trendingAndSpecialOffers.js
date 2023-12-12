
export const initialProductDetails = {};

const trendingAndSpecialOffersReducer = (state = initialProductDetails,action)=>{
    if(action.type=='inTrendingAndSpecialOffersRequest'){
        return {
            loading:true,
            data:state
        };
    }else if(action.type=='inTrendingAndSpecialOffersSuccess'){
        return {
            loading:false,
            inTrendings:action.payload.inTrendings,
            specialOffers:action.payload.specialOffers
        };
    }else if(action.type=='inTrendingAndSpecialOffersFail'){
        return {
            loading:false,
        };
    }else{
        return state
    }
}

export default trendingAndSpecialOffersReducer