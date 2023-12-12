import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

// importing css
import { Offcanvas,Accordion} from 'react-bootstrap';
import '../styles/SearchedProductsList.css'

// importing Component 
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading'
import Empty from '../components/Empty'

import { GetSearchedProducts } from '../apiCalls/GetSearchedProducts';
import { Navigate } from 'react-router-dom';

const genderArray = [
  {name:'mens',text:'Mens'},
  {name:'momen',text:'Womens'},
  {name:'girls',text:'Girls'},
  {name:'boys',text:'Boys'},
]
const occasionArray = [
    {text:'Party Wear',name:'party'},
    {text:'Casual',name:'casual'},
    {text:'Formal',name:'formal'},
]



const SearchedProductsList = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // getting first search values 
    const [productsArray, setProductsArray] = useState([]);
    const [areProductsFetched, setAreProductsFetched] = useState(false);
    const search = new URLSearchParams(window.location.search).get('search');
    async function loadAllData(search,filterData) {
        setAreProductsFetched(false);
        const response = await GetSearchedProducts(search,filterData,'user');
        setProductsArray(response);
        await setAreProductsFetched(true);
    }

    useEffect(() => {
        loadAllData(search);
    }, [window.location.href])

    
    const [inputs, setInputs] = useState({
        minValue:"",maxValue:"",mens:false,womens:false,boys:false,girls:false,casual:false,party:false,formal:false
    })
    
      
    let name,value,check;
    const handleChange = (e)=>{
        name = e.target.name;
        value = e.target.value;
        check = e.target.checked;
        if(name=='minValue' || name=='maxValue'){
            setInputs({...inputs,[name]:value});
        }else{
            setInputs({...inputs,[name]:check});
        }
    }
   
    const navigate = useNavigate();
    const applyFilters = ()=>{
        let filterData = {};
        let filterGenderArray = [];
        let filterOccasionArray = [];
        genderArray.forEach((item) => {
            if(inputs[item.name]){
                filterGenderArray.push(item.text);
            }
        });
        if(filterGenderArray.length){
            filterData['gender'] = {$in:filterGenderArray};
        }

        occasionArray.forEach((item) => {
            if(inputs[item.name]){
                filterOccasionArray.push(item.text);
            }
        });
        if(filterOccasionArray.length){
            filterData['occasion'] = {$in:filterOccasionArray};
        }

        let min=parseInt(inputs.minValue)
        let max=parseInt(inputs.maxValue)
        if(min && max){
            filterData['price'] = {$lte:max,$gte:min};
        }else if(max){
            filterData['price'] = {$lte:max};
        }else if(min){
            filterData['price'] = {$gte:min};
        }

        loadAllData(search,filterData,'user');
        setShow(false);
    }

  return (

    <div id='searchedProductList'>
        <div className='addFilterButton font1' onClick={handleShow}>
            Add Filter
        </div>

        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body className='font1'>
                <form action="">
                    <div className="filterBox">
                        <div className="subHeading font1">Gender</div>
                        {genderArray.map((item,ind)=>(
                          <div  key={ind} className="d-flex box">
                            <input type="checkbox" name={item.name} checked={inputs[item.name]} onChange={handleChange} />
                            <div className='item ms-2'>{item.text}</div>
                          </div>
                        ))}
                    </div>

                    <div className="filterBox">
                        <div className="subHeading font1">Occasion</div>
                        {occasionArray.map((item,ind)=>(
                          <div key={ind} className="d-flex box">
                            <input type="checkbox" name={item.name} checked={inputs[item.name]} onChange={handleChange} />
                            <div className='item ms-2'>{item.text}</div>
                          </div>
                        ))}
                    </div>
                    <div className="filterBox">
                        <div className="subHeading font1">Price</div>
                          <div className="d-flex justify-content-between box">
                            <input name='minValue' value={inputs.minValue} type="text" placeholder='Min(₹)' onChange={handleChange} />
                            <input name='maxValue' value={inputs.maxValue} type="text" placeholder='Max(₹)' onChange={handleChange} />
                          </div>
                    </div>
                        
                  <div className="submit btn w-100" id='filterButton' onClick={applyFilters}>Apply Filters</div>
                </form>
            </Offcanvas.Body>
        </Offcanvas>

        <div className="my-2 container-fluid">
            <div className="overflow-hidden">
                <div className='d-flex flex-wrap align-items-center box'>
                    {areProductsFetched ==false
                        ?<Loading />
                        :productsArray.length==0
                        ?<Empty />
                        :productsArray.map((product,ind)=>(
                            <ProductCard type='user' key={ind} product={product} />
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default SearchedProductsList