import React, { useContext, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SaltContext } from '../../context/SaltContext';

const SearchBar = ({ isEmpty, setIsEmpty, setIsLoading }) => {
  const [searchText, setSearchText] = useState("")

  const { setAllSaltData } = useContext(SaltContext)

  const handleSubmitOnClick = async () => {
    if(searchText.length !== 0){
    try {
      setIsEmpty(false);
      setIsLoading(true)

      const response = await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${searchText}&pharmacyIds=1,2,3`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      setAllSaltData(data.data);

      return; 
    } catch (error) {
      console.error('Error fetching data:', error);
    }finally{
      setIsLoading(false)
    }
  }else{
    console.log("Search is empty")
  }
  };

  const handleBackOnClick = () => {
    setIsEmpty(true)
    setSearchText("")
  }  

  return (
    <div className='max-w-5xl w-full h-16 rounded-[36px] shadow-center flex justify-between items-center px-8 my-8 mx-auto'>
      <div className='flex-grow items-center flex'>
        {!isEmpty ?
          <span onClick={handleBackOnClick} className='cursor-pointer'>
            <ArrowBackIcon />
          </span>
          :
          <SearchIcon />
        }
        <input className='ml-6 text-base font-medium outline-none p-1 min-w-0 flex-grow'
          type='text'
          placeholder='Type your medicine name here'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              handleSubmitOnClick();
            }}
        />
      </div>
      <button onClick={handleSubmitOnClick} className=' text-[#2A527A] font-semibold'>Search</button>
    </div>
  )
}

export default SearchBar