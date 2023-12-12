// importing librarirs 
import react,{useEffect,useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { BrowserRouter, Routes, Route } from "react-middleware-router";
import {useDispatch,useSelector} from 'react-redux'


// importing all pages or components 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchedProductsList from './pages/SearchedProductsList';
import MensSection from './pages/MensSection';
import WomensSection from './pages/WomensSection';
import KidsSection from './pages/KidsSection';
import Whilist from './pages/Whilist';
import Cart from './pages/Cart';
import ProductPage from './pages/ProductPage';
import AddProducts from './pages/AddProducts';
import EditProducts from './pages/EditProducts';
import AllProducts from './pages/AllProducts';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AddressInfo from './pages/AddressInfo';
import Success from './pages/Success';
import Payment from './pages/Payment';
import DeliveredOrders from './pages/DeliveredOrders';
import UserOrders from './pages/UserOrders';
import NewOrders from './pages/NewOrders';
import SearchBarPage from './pages/SearchBarPage';

import ScrollToTop from './ScrollToTop';


// importing css 
import './styles/global.css';

// importing action to get all user details 
import {userDetailsAction} from './actions/userDetails'
import {inTrendingAndSpecialOffersAction} from './actions/trendingAndSpecialOffers'



function App() {

	const dispatch = useDispatch();


	// checking user existance 
	const loadAllData = async ()=>{
		dispatch(userDetailsAction());
		dispatch(inTrendingAndSpecialOffersAction());
	}
	
	useEffect(() => {
		loadAllData();
		window.scrollTo(0, 0)
	}, [])
	



	return (
		<div>
		
		<BrowserRouter>
			<div>
				<ScrollToTop />
				<Navbar />
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/products" element={<SearchedProductsList />} />
					<Route exact path="/mensSection" element={<MensSection />} />
					<Route exact path="/kidsSection" element={<KidsSection />} />
					<Route exact path="/womensSection" element={<WomensSection />} />
					<Route exact path="/whilist" element={<Whilist />} />
					<Route exact path="/mycart" element={<Cart />} />
					<Route exact path="/product" element={<ProductPage />} />
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/signup" element={<Signup />} />
					<Route exact path="/forgotPassword" element={<ForgotPassword />} />
					<Route exact path="/add" element={<AddProducts />} />
					<Route exact path="/edit/:id" element={<EditProducts />} />
					<Route exact path="/allProducts" element={<AllProducts />} />
					<Route exact path="/addressInfo" element={<AddressInfo />} />
					<Route exact path="/success" element={<Success />} />
					<Route exact path="/payment" element={<Payment />} />
					<Route exact path="/deliveredOrders" element={<DeliveredOrders />} />
					<Route exact path="/newOrders" element={<NewOrders />} />
					<Route exact path="/userOrders" element={<UserOrders />} />
					<Route exact path="/search" element={<SearchBarPage />} />
				</Routes>
				<Footer />
			</div>
		</BrowserRouter>
		</div>
	);
}

export default App;
