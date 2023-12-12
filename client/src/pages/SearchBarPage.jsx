import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'

import {BiArrowBack} from 'react-icons/bi'
import {suggestionBox} from '../information/suggestionBox'

import '../styles/searchBarPage.css'
const SearchBarPage = () => {

    const [searchInput, setSearchInput] = useState("");

    const navigate = useNavigate();
    const goBack = ()=>{
        const prevLink = sessionStorage.getItem('prevLink');
        navigate(prevLink);
    }
    const searchProducts = (e)=>{
        if(e.key==="Enter"){
            navigate(`/products?search=${searchInput}`)
        }
    }
   

    return (
        <div className="searchBox" id="searchBarPage">
            <div className="searchBox">
                <BiArrowBack onClick={goBack} />
                <input onKeyPress={searchProducts} autoFocus="autoFocus" className='font1' name='search' type="text" value={searchInput} placeholder='Search product' onChange={(e)=>{setSearchInput(e.target.value)}} />
            </div>
            <div className="suggestionBox font1">
                {suggestionBox.filter((item)=>{
                    if(searchInput.length>0){
                        let str = searchInput;
                        str = str.toLowerCase();
                        str = str+ ".*";
                        let regExp = new RegExp(str);
                        return regExp.test(item.toLowerCase());
                    }
                    return false;
                }).map((item,ind)=>(
                    <Link key={ind} to={'/products?search='+ item}>{item}</Link>
                ))}
            </div>
        </div>
    )
}

export default SearchBarPage