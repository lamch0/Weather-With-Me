import React from 'react'
import Homepage from './pages/Homepage.js'
import Locationpage from './pages/Locationpage.js'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
function App() {
  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/Singlelocation/:location' element={<Locationpage/>} />
          </Routes>
        </Router>
          </div>
      </>
  );
}

export default App


