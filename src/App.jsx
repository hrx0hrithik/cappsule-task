import { useContext, useState } from 'react'
import './App.css'
// import Card from './components/Card'
import SearchBar from './components/SearchBar'
import { SaltContext } from '../context/SaltContext'
import Card2 from './components/Card2'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [isEmpty, setIsEmpty] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { saltSuggestion } = useContext(SaltContext)

  return (
    <>
      <div className='flex flex-col justify-center w-full'>
        <div className=' text-2xl my-3'>Cappsule web development test</div>
        <SearchBar isEmpty={isEmpty} setIsEmpty={setIsEmpty} setIsLoading={setIsLoading} />
        <div className=' h-1 w-[90%] border-t-2 mt-11 mx-auto' ></div>
      </div>
      {isEmpty ?
        <div className=' flex justify-center items-center min-h-[55vh]'>
          <div className=' font-semibold text-xl text-[#888888]'>“ Find medicines with amazing discount “</div>
        </div>
        :
        (isLoading ? (
          <div className='flex justify-center items-center min-h-[55vh]'>
            <LoadingSpinner />
          </div>
        ) : (
          saltSuggestion.length === 0 ? (
            <div className=' flex justify-center items-center min-h-[55vh]'>
              <div className=' font-semibold text-xl text-[#888888]'>“ Sorry we did not find any matching results ”</div>
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center my-9 px-5'>
              {saltSuggestion.map((card) => (
                // <Card key={card.id} card={card} />
                <Card2 key={card.id} card={card} />
              ))}
            </div>
          )
        ))
      }
    </>
  )
}

export default App
