import React,{useEffect,useState} from 'react'
import {Link,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

import {Alert,Offcanvas,Accordion} from 'react-bootstrap'


// importing components 
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import Empty from '../components/Empty';
import AlertBox from '../components/AlertBox';

import '../styles/allProducts.css'


// impoerting api call to get all products 
import {GetSearchedProducts} from '../apiCalls/GetSearchedProducts';

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

const AllProducts = () => {
    // data from redux 
    let {loading=true,status,isAdmin} = useSelector((state)=>state.userDetailsReducer);
    const navigate = useNavigate();

    // for iffcanvas filter box by bootstrap 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [errorAlert, setErrorAlert] = useState('none');


    
    
    
    const [productsArray, setProductsArray] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    async function loadAllData(search,filterData) {
        setIsDataFetched(false);
        const response = await GetSearchedProducts(search,filterData);
        await setIsDataFetched(true);
        setProductsArray(response);
    }

    const [searchInput, setSearchInput] = useState("");



    useEffect(() => {
        if(!loading && status==200 && isAdmin){
            loadAllData(searchInput);
        }else if(!loading && (status != 200 || !isAdmin)){
            navigate('/login');
        }
    }, [window.location.href,loading])

    
    const [inputs, setInputs] = useState({
        minValue:"",maxValue:"",rating:"",stock:"",mens:false,womens:false,boys:false,girls:false,casual:false,party:false,formal:false,
        inTrending:false,specialOffer:false
    })
    
      
    let name,value,check;
    const handleChange = (e)=>{
        name = e.target.name;
        value = e.target.value;
        check = e.target.checked;
        if(name=='minValue' || name=='maxValue' || name=='stock' || name=='rating'){
            setInputs({...inputs,[name]:value});
        }else{
            setInputs({...inputs,[name]:check});
        }
    }
   
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

        let min=parseInt(inputs.minValue);
        let max=parseInt(inputs.maxValue);
        let stock=parseInt(inputs.stock);
        let rating=parseInt(inputs.rating);
        if(min && max){
            filterData['price'] = {$lte:max,$gte:min};
        }else if(max){
            filterData['price'] = {$lte:max};
        }else if(min){
            filterData['price'] = {$gte:min};
        }

        if(stock){
            filterData['stock'] = {$lte:stock};
        }
        if(rating){
            filterData['rating'] = {$lte:rating};
        }

        if(inputs.specialOffer){
            filterData['specialOffer'] = true;
        }
        if(inputs.inTrending){
            filterData['inTrending'] = true;
        }

        setShow(false);
        loadAllData(searchInput,filterData);
    }

    

    // for deleting a product 
    
    const [deleteBox, setDeleteBox] = useState('none');
    const [productId, setproductId] = useState("");

    const deleteProduct = (id)=>{
        setproductId(id);
        setDeleteBox('flex');
    }
    const deleteProductRequest = async ()=>{
        try{
            const res = await fetch('/api/deleteProduct',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    productId:productId
                })
            });
            if(res.status==200){
                setDeleteBox('none');
                loadAllData(searchInput);
            }else{
                setDeleteBox('none');
                setErrorAlert('block');
                setTimeout(() => {
                    setErrorAlert('none');
                }, 2000);
            }
        }catch(err){
            setDeleteBox('none');
            setErrorAlert('block');
            setTimeout(() => {
                setErrorAlert('none');
            }, 2000);
        }
    }
    
    return (
        <div id='allProducts'>
             <AlertBox content="Unable to delete,There is some error" status="500" display={errorAlert} />

            {/* filter box  */}
            <div className='addFilterButton font1' onClick={handleShow}>
                Add Filter
            </div>
            <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body className='font1'>
                <form action="">
                    
                    <div className="filterBox">
                        <div className="d-flex box">
                            <input type="checkbox" name='inTrending' checked={inputs.inTrending} onChange={handleChange} />
                            <div className='item ms-2'>In Trendings</div>
                        </div>  
                    </div>


                    <div className="filterBox">
                        <div className="d-flex box">
                            <input type="checkbox" name='specialOffer' checked={inputs.specialOffer} onChange={handleChange} />
                            <div className='item ms-2'>Special Offers</div>
                        </div>  
                    </div>


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

                    <div className="filterBox">
                        <div className="subHeading font1">Stock</div>
                        <input className='w-100' name='stock' value={inputs.stock} type="text" placeholder='less than' onChange={handleChange} />
                    </div>
                        

                    <div className="filterBox">
                        <div className="subHeading font1">Rating</div>
                        <input className='w-100' name='rating' value={inputs.rating} type="text" placeholder='less than' onChange={handleChange} />
                    </div>
                        
                  <div className="submit btn w-100" id='filterButton' onClick={applyFilters}>Apply Filters</div>
                </form>
            </Offcanvas.Body>
            </Offcanvas>

            <div className='alertBox' style={{display:deleteBox}}>
                <div className="box">
                    <div className="subHeading font1 mb-2" style={{color:'gray'}}>Delete Product</div>
                    <div className="font1 mb-3">Are u sure u want to delete it</div>
                    <div className="btn btn-danger" onClick={()=>{deleteProductRequest()}}>Delete</div>
                    <div className="btn btn-primary" onClick={()=>{setDeleteBox('none')}}>Cancel</div>
                </div>
            </div>

            <div className="container-fluid pt-2 pb-5">
                <div className="d-flex searchBox">
                    <input className='font1' name='search' type="text" placeholder='Search product' value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}} />
                    <div className="btn bgColor searchBtn" onClick={()=>{loadAllData(searchInput)}}>Search</div>
                </div>

                <div className='d-flex flex-wrap align-items-center'>
                    {!isDataFetched
                    ? <Loading />
                    :productsArray.length==0
                    ?<Empty/>
                    :productsArray.map((product,ind)=>(
                        <ProductCard type='admin' key={ind} product={product} deleteProduct={deleteProduct} />
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default AllProducts