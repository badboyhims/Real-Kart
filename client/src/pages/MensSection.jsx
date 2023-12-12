import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';

// importing components 
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import RectangularCard from '../components/RectangularCard';

import { mensCategoryArray } from '../information/categoryArrays';



const MensSection = () => {
    let {loading,inTrendings,specialOffers} = useSelector((state)=>state.trendingAndSpecialOffersReducer);
    const [specialOnes, setSpecialOnes] = useState([])
   
    useEffect(() => {
        if(loading===false){
            let arr1 = inTrendings;
            let arr2 = specialOffers;
            let arr = Array.from(new Set([...arr1, ...arr2]))
            arr = arr.map(e => e['productId']).map((e, i, final) => final.indexOf(e) === i && i).filter((e) => arr[e]).map(e => arr[e]);
            setSpecialOnes(arr);
            
        }
    }, [loading])

  return (
    <div className='genderSection py-3' id='mensSection'>    

        <div className="heading font1 text-center textColor my-3">FOR MENS</div>

        {loading===false && 
            <div className='parentBoxOfCards my-2 container-fluid'>
                <div className="font1 text-secondary mb-1 subHeading text-center">Special Ones</div>
                <div className='d-flex flex-wrap align-items-center box'>
                    {specialOnes.map((product,ind)=>(
                        product.gender=='Mens' && <ProductCard type='user' key={ind} product={product} />
                    )) }
                </div>
            </div>
        }
           


        {/* shown by categories  */}
        <div className='parentBoxOfCards my-2 container-fluid mt-2'>
            <div className="font1 text-secondary subHeading mb-1 text-center">Shop By Category</div>
            <div className="d-flex flex-wrap justify-cotent-between">
                {mensCategoryArray.map((value,index)=>(
                    <CategoryCard key={index} link={value.link}  img={value.img} category={value.category} />
                ))}
            </div>
        </div>


        <div className="container-fluid my-5 d-flex rectangularCardBox">
            <RectangularCard  link={'/products?search=mens party wear'} img={'/images/weddingMen.jpg'} text="Party Wear" />
            <RectangularCard link={'/products?search=mens formal'}  img={'/images/formalMen.jpg'} text="Formal" />
            <RectangularCard link={'/products?search=mens casual'}  img={'/images/casualMen.jpg'} text="Causual" />
        </div>
    </div>
  )
}

export default MensSection