import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addEntry, deleteEntry, updateEntry } from './redux/actions';
import { formatNumber } from './functions/numbers';
import { ChevronDown, ChevronsDown, ChevronsUp, GitHub, Instagram, Plus, Trash, Twitch, Twitter, X, Youtube } from 'react-feather';

const Fields = ({entryData}) => {

  const [values, setValues] = useState({
    unit: 0,
    grade: 0
  })
  const [modified, setModified] = useState(false)
  const [screen, setScreen] = useState(0)

  const dispatch = useDispatch()
  

  const onChangeHandler = (e) => {
    const newValues = {
      ...values,
      [e.target.name] : e.target.value
    }
    if (!modified) {
      setModified(true)
    }
    setValues(newValues)
  }
  
  const setScreenSize = () => {
    setScreen(window.innerWidth)
  }
  
  useEffect(() => {
    window.addEventListener('resize', setScreenSize)
  }, [])

  useEffect(() => {
    if (modified) {
      dispatch(updateEntry(entryData.uuid, values))
    }
  },[values])

  return (
    <div className={`relative w-full pt-5 flex items-center sf text-gray-500 ${screen < 500 ? '':'gap-x-5'}`}>
      <input className='w-1/2 px-5 p-3 rounded-full focus:outline-none' type='number' value={entryData.grade} name='grade' onChange={e => onChangeHandler(e)}/>
      <div className={`${screen < 500 ? 'text-white mx-1':'absolute text-white mt-8 right-0 top-0 -mr-8'}`}>
        <button onClick={() => dispatch(deleteEntry(entryData.uuid))}><Trash/></button>
      </div>
      <input className='w-1/2 px-5 p-3 rounded-full focus:outline-none' type='number' value={entryData.unit} name='unit' onChange={e => onChangeHandler(e)}/>
    </div>
  )
}


function App() {
  const entries = useSelector(state => state.entries)
  const dispatch = useDispatch()

  const [showGWA, setShowGWA] = useState(false)
  const [gwa, setGwa] = useState(0)
  const [canCompute, setCanCompute] = useState(true)
  const [showCred, setShowCred] = useState(false)
  const [screen, setScreen] = useState(0)

  const computeGWA = () => {
    let sumOfProducts = 0;
    let sumOfUnits = 0
    for(let i = 0; i < entries.length; i++) {
      sumOfProducts += parseInt(entries[i].grade) * parseInt(entries[i].unit)
      sumOfUnits += parseInt(entries[i].unit)
    }

    const gwa = sumOfProducts/sumOfUnits

    setGwa(gwa)
    setShowGWA(true)
    setCanCompute(false)
  }

  const setScreenSize = () => {
    setScreen(window.innerWidth)
  }
  
  useEffect(() => {
    window.addEventListener('resize', setScreenSize)
  },[])

  useEffect(() => {
    if (!canCompute) {
      setCanCompute(true)
    }
    setShowGWA(false)
  }, [entries])

  return (
    <div className='bg-purple-800'>
      <div className={`text-white w-full overflow-hidden ${screen < 500 ? 'text-lg pt-10 flex flex-col':( screen < 1000 ? 'px-10 text-4x py-16 text-4xl':'px-40 text-6x py-16 text-6xl')}`}>
        <div className={`gothWideThin ${screen < 500 ? 'text-5xl text-center':''}`}>GWA</div>
        <div className={`gothWide ${screen < 500 ? 'text-sm text-center':''}`}>CALCULATOR</div>
      </div>
      <div className={`${screen < 500 ? 'p-5':(screen < 1000 ? 'px-10 pb-20':'px-40 pb-20')}`}>
        <div className={`${screen < 500 ? '':(screen < 1000 ? 'w-full mx-auto':'w-1/2 mx-auto')}`}>
          <div className={`flex ${screen < 500 ? 'gap-8':' gap-5'}`}>
            <div className={`${screen < 500 ? 'p-2':'p-5'} w-1/2 flex items-center justify-center bg-indigo-600 rounded-full`}>
              <p className={`text-white sf ${screen < 500 ? '':'text-2xl'}`}>GRADE</p>
            </div>
            <div className={`${screen < 500 ? 'p-2':'p-5'} bg-indigo-600 rounded-full w-1/2 flex items-center justify-center`}>
              <p className={`text-white sf ${screen < 500 ? '':'text-2xl'}`}>UNIT</p>
            </div>
          </div>
          {
            entries.length > 0 &&
            entries.map(item => <Fields entryData={item} />)
          }
          <div className='flex flex-col gap-3 items-center py-5'>
            <button className='rounded-full w-full p-5 px-8 flex items-center gap-x-3 justify-center text-white sfB outline-none' onClick={() => dispatch(addEntry())}><span><Plus /></span>Add Entry</button>
            { entries.length > 1 && (
              canCompute ? 
              <div>
                <button className={`relative p-3 px-8 text-yellow-400 border-white gothWide animate-pulse ${screen < 500 ? 'text-4xl ':'text-5xl '}`} onClick={computeGWA}>COMPUTE</button>
              </div>
              :
              <div>
                <button className={`p-3 px-8 text-gray-100 gothWide opacity-20 cursor-not-allowed ${screen < 500 ? 'text-xl ':'text-5xl '}`}>COMPUTE</button>
              </div>
            ) }
          </div>
          {
            <div className='relative text-center mt-5 bg-indigo-700 transition-all linear duration-300  overflow-hidden' style={{height: showGWA ? '150px': '0' ,padding: showGWA ? '20px 0' : '0' }}>
              <p className='text-3xl sf text-white'>GWA Score</p>
              <p className='text-white gothWide text-5xl py-5'>{formatNumber(gwa)}</p>
            </div>
          }
        </div>
      </div>
      <div className='absolute bottom-0 right-0 mb-10 mr-10'>
        <button className='bg-black p-3 shadow-sm opacity-50 hover:opacity-100 transition-all linear duration-300 text-white rounded-full px-5' onClick={() => setShowCred(!showCred)}>About the dev</button>
      </div>

      <div className='absolute bottom-0 w-full bg-purple-900 overflow-hidden transition-all linear duration-300' style={{height: showCred ? '320px' : '0', padding: showCred ? '20px' : undefined}}>
        <button className="absolute right-0 mr-5 text-white" onClick={() => setShowCred(!showCred)}><ChevronsDown /></button>
        <div className='w-1/3 mx-auto text-white'>
          <p className='text-center sf opacity-50'>Developed by: </p>
          <div className='flex flex-col items-center py-5 gap-y-3'>
            <div className='w-16 h-16 bg-gray-300 rounded-full overflow-hidden'>
              <img src='/img/profile_pic.jpg' />
            </div>
            <p className='sf'>Kim Fajardo</p>
            <p className='opacity-20 italic text-center'>A junior dev who loves creating small <br/> tools to improve productivity.</p>
          </div>
          <div className='flex justify-center gap-x-5'>
            <a href='https://www.youtube.com/channel/UCGjUeKXukZCtA7FoUehJVWw'><Youtube/></a>
            <a href='https://www.instagram.com/kimfajardo_/'><Instagram /></a>
            <a href='https://github.com/kimpfajardo'><GitHub/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
