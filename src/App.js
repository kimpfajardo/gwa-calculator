import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addEntry, deleteEntry, updateEntry } from './redux/actions';
import { formatDecimal, formatNumber } from './functions/numbers';
import { ChevronsDown, GitHub, Instagram, Plus, Trash, } from 'react-feather';
import { Helmet } from 'react-helmet';

const Fields = ({entryData}) => {

  const [values, setValues] = useState({
    unit: null,
    grade: null
  })
  const [modified, setModified] = useState(false)

  const dispatch = useDispatch()
  

  const onChangeHandler = (e) => {
    if (!modified) {
      setModified(true)
    }

    const newValues = {
      ...values,
      [e.target.name] : e.target.value
    }
    setValues(newValues)
    if (modified) {
      dispatch(updateEntry(entryData.uuid, newValues))
    }
  }

  return (
    <div className={`relative w-full pt-5 flex items-center sf text-gray-500 sm:gap-x-5`}>
      <input className={`w-1/2 px-5 p-3 rounded-full focus:outline-none ${entryData.grade_error &&'border-2 border-red-400'}`} type='number' value={entryData.grade} name='grade' placeholder='0.00' onChange={e => onChangeHandler(e)} min={1}/>
      <div className={`text-white sm:hidden mx-2`}>
        <button onClick={() => dispatch(deleteEntry(entryData.uuid))}><Trash/></button>
      </div>
      <input className={`w-1/2 px-5 p-3 rounded-full focus:outline-none ${entryData.unit_error &&'border-2 border-red-400'}`} type='number' value={entryData.unit} name='unit' placeholder='0.00' onChange={e => onChangeHandler(e)} min={1}/>
      <div className={`hidden sm:block sm:absolute text-white sm:mt-8 sm:right-0 sm:top-0 sm:-mr-8`}>
        <button onClick={() => dispatch(deleteEntry(entryData.uuid))}><Trash/></button>
      </div>
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

  const computeGWA = () => {
    let sumOfProducts = 0;
    let sumOfUnits = 0
    for(let i = 0; i < entries.length; i++) {
      if (parseInt(entries[i].grade) === null && parseInt(entries[i].unit) !== null) {
        break
      }
      if (parseInt(entries[i].unit) !== null) {
        sumOfProducts += parseInt(entries[i].grade) * parseInt(entries[i].unit)
        sumOfUnits += parseInt(entries[i].unit)
      }
    }

    const gwa = sumOfProducts/sumOfUnits

    setGwa(gwa)
    setShowGWA(true)
    setCanCompute(false)
  }

  const checkBeforeCompute = () => {
    const brokenEntries = entries.filter(item => item.unit === null || item.grade === null)
    for (let i = 0; i < brokenEntries.length; i++) {
      dispatch(updateEntry(brokenEntries[i].uuid, {unit: brokenEntries[i].unit,
        grade: brokenEntries[i].grade}, brokenEntries[i].unit ? null : 'Unit cannot be blank',  brokenEntries[i].grade ? null : 'Grade cannot be blank'))
    }
    if (brokenEntries.length === 0) {
      computeGWA()
    }
  }

  useEffect(() => {
    if (!canCompute) {
      setCanCompute(true)
    }
    setShowGWA(false)
  }, [entries])

  return (
    <>
      <Helmet>
        <title>GWA Calculator</title>
        <meta name="GWA Calculator" content="Compute your grades easier and faster with this app!" />
      </Helmet>
      <div className='bg-purple-800'>
        <div className={`text-white w-full overflow-hidden header sm:text-5xl pt-5 sm:p-10`}>
          <div className={`gothWideThin header_title text-center text-4xl sm:text-5xl sm:text-left`}>GWA</div>
          <div className={`gothWide header_title text-center sm:text-left`}>CALCULATOR</div>
        </div>
        <div className={`px-3 pt-3 sm:px-10 sm:pt-5`}>
          <div className={`w-full lg:w-2/3 lg:mx-auto xl:w-3/5 2xl:w-max`}>
            <div className={`flex w-full gap-x-5 bg-indigo-600 sm:bg-opacity-0 rounded-full`}>
              <div className={`w-1/2 flex items-center justify-center bg-indigo-600 rounded-full p-2 2xl:w-96`}>
                <p className={`text-white sf text-md sm:text-2xl`}>GRADE</p>
              </div>
              <div className={`w-1/2 flex items-center justify-center bg-indigo-600 rounded-full p-2 2xl:w-96`}>
                <p className={`text-white sf text-md sm:text-2xl`}>UNIT</p>
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
                  <button className={`relative p-3 px-8 text-yellow-400 border-white gothWide animate-pulse text-4xl `} onClick={checkBeforeCompute}>COMPUTE</button>
                </div>
                :
                <div>
                  <button className={`p-3 px-8 text-gray-100 gothWide opacity-20 cursor-not-allowed text-4xl`}>COMPUTE</button>
                </div>
              ) }
            </div>
            
          </div>
        </div>
        {
          <div className='relative text-center mt-5 bg-indigo-700 transition-all linear duration-300  overflow-hidden' style={{height: showGWA ? '150px': '0' ,padding: showGWA ? '20px 0' : '0' }}>
            <p className='text-3xl sf text-white'>GWA Score</p>
            <p className='text-white gothWide text-5xl py-5'>{formatNumber(gwa)}</p>
          </div>
        }
        <div className='absolute bottom-0 right-0 mb-10 mr-10'>
          <button className='bg-black p-3 shadow-sm opacity-50 hover:opacity-100 transition-all linear duration-300 text-white rounded-full px-5' onClick={() => setShowCred(!showCred)}>About the dev</button>
        </div>

        <div className='absolute bottom-0 w-full bg-purple-900 overflow-hidden transition-all linear duration-300' style={{height: showCred ? '320px' : '0', padding: showCred ? '20px' : undefined}}>
          <button className="absolute right-0 mr-5 text-white z-50" onClick={() => setShowCred(!showCred)}><ChevronsDown /></button>
          <div className='w-full sm:w-1/3 mx-auto text-white'>
            <p className='text-center sf opacity-50'>Developed by: </p>
            <div className='flex flex-col items-center py-5 gap-y-3'>
              <div className='w-16 h-16 bg-gray-300 rounded-full overflow-hidden'>
                <img src='/img/profile_pic.jpg' alt="Hi! I'm Kim" />
              </div>
              <p className='sf'>Kim Fajardo</p>
              <p className='opacity-20 italic text-center w-full'>A junior dev who loves creating small tools to improve productivity.</p>
            </div>
            <div className='flex justify-center gap-x-5'>
              {/* <a href='https://www.youtube.com/channel/UCGjUeKXukZCtA7FoUehJVWw'><Youtube/></a> */}
              <a href='https://www.instagram.com/kimfajardo_/'><Instagram /></a>
              <a href='https://github.com/kimpfajardo'><GitHub/></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
