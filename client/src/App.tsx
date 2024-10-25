import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Income from './pages/Income'
import Expenses from './pages/Expenses'
import Budget from './pages/Budget'
import Statistics from './pages/Statistics'
import Reports from './pages/Reports'
import Footer from './components/Footer'


const App:React.FC = () => {
  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/expense" element={<Expenses/>}/>
            <Route path="/income" element={<Income/>}/>
            <Route path="/budget" element={<Budget/>}/>
            <Route path="/statistics" element={<Statistics/>}/>
            <Route path="/reports" element={<Reports/>}/>
        </Routes>
        <Footer/>
      </Router>
    </div>
  )
}

export default App
