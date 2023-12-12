import React from 'react'
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';

// import css 
import { Carousel} from 'react-bootstrap';


// importing components 
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import RectangularCard from '../components/RectangularCard';

import { categoryArray } from '../information/categoryArrays';


import '../styles/home.css'
    
let slider1 =  '/images/imp/slider1.jpg';
let slider2 =  '/images/imp/slider2.jpg';
let slider3 =  '/images/imp/slider3.jpg';
let mensSection =  '/images/mensSection.jpg';
let womensSection =  '/images/womensSection.jpg';
let kidsSection =  '/images/kidsSection.jpg';





const Home = () => {

   
    let {loading,inTrendings,specialOffers} = useSelector((state)=>state.trendingAndSpecialOffersReducer);
    

  return (
        <div id="home">
            {/* top carousel  */}
            <Carousel>
                <Carousel.Item>
                    <img className="d-block w-100" src={slider1} alt="Mens Section"/>
                    <Carousel.Caption> 
                        <div className="font1 heading">Have a look on our best collections for mens</div>
                        <Link to='/mensSection'>
                            <div className="btn">Men's Section</div>
                        </Link>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={slider2} alt="Womens Section"/>
                    <Carousel.Caption> 
                        <div className="font1 heading">Have a look on our best collections for Womens</div>
                        <Link to='/womensSection'>
                            <div className="btn">Womens's Section</div>
                        </Link>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={slider3} alt="Kids Section"/>
                    <Carousel.Caption> 
                    <div className="font1 heading">Hey kids are here for you</div>
                        <Link to='/kidsSection'>
                            <div className="btn">Kids's Section</div>
                        </Link>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            {/* special offers  */}
            {loading===false &&
            <div className="parentBoxOfCards my-2 container-fluid">
                <div className="font1 font-md textColor heading text-center">Special Offers</div>
                <div className='d-flex flex-wrap align-items-center box'>
                    {specialOffers.map((product,ind)=>(
                        <ProductCard type='user' key={ind} product={product} />
                    ))}
                </div>
            </div>
            }
            {/* trending  */}
            {loading===false &&
            <div className="parentBoxOfCards my-2 container-fluid">
                <div className="font1 font-md textColor heading text-center">In Trendings</div>
                <div className='d-flex flex-wrap align-items-center box'>
                    {inTrendings.map((product,ind)=>(
                        <ProductCard type='user' key={ind} product={product} />
                    ))}
                </div>
            </div>
            }

            
            {/* mens kids womens section  */}
            <div className="container-fluid my-5 d-flex rectangularCardBox">
               <RectangularCard link={'mensSection'} img={mensSection} text="For Mens" />
               <RectangularCard link={'womensSection'} img={womensSection} text="For Womens" />
               <RectangularCard link={'kidsSection'} img={kidsSection} text="For Kids" />
            </div>

                
            {/* shown by categories  */}
            <div className="parentBoxOfCards my-2 container-fluid">
                <div className="font1 font-md textColor heading mb-2 text-center">Categories To Bag</div>
                <div className='d-flex flex-wrap align-items-center box'>
                    {categoryArray.map((value,index)=>(
                        <CategoryCard key={index} link={value.link}  img={value.img} category={value.category} />
                    ))}
                </div>
            </div>
            
                
        </div>        
  )
}

export default Home