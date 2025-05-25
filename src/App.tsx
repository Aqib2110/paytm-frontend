import { useState } from 'react'
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/Home';
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/signin' element={<Signin/>}/>
    </Routes>
    <Toaster />
    </BrowserRouter>
    </>
  )
}

export default App
