import React from 'react'
import Homepage from './pages/Homepage.js'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
function App() {
  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
          <Route path='/' element={<Homepage/>} />
          </Routes>
        </Router>
          </div>
      </>
  );
}

export default App


