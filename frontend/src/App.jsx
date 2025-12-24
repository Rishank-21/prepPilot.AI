import React from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Home/Dashboard'
import InterviewPrep from './pages/interviewPrep/InterviewPrep'
import UserProvider from './contexts/UserContext'

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route  path='/' element = {<LandingPage/>}/>
          <Route  path='/login' element = {<Login/>}/>
          <Route  path='/signup' element = {<SignUp/>}/>
          <Route  path='/dashboard' element = {<Dashboard/>}/>
          <Route  path='/interview-prep/:sessionId' element= {<InterviewPrep/>}/>
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className : "",
          style : {
            fontSize : "13px"
          },
        }}
      />
    </div>
  </UserProvider>
  )
}

export default App
