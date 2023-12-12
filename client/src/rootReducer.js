import {combineReducers} from 'redux'
import userDetailsReducer from './reducers/userDetails'
import trendingAndSpecialOffersReducer from './reducers/trendingAndSpecialOffers'
const rootReducer = combineReducers({
    userDetailsReducer,trendingAndSpecialOffersReducer
})

export default rootReducer