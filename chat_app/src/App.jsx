/* eslint-disable react/prop-types */
import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./modules/Dashboard"
import Form from "./modules/Form"

const ProtectedRoutes = ({children}) => {
  
  const isLoggedIn = localStorage.getItem('user:token') !== null;

  if(!isLoggedIn && window.location.pathname === '/') return <Navigate to='/sign_in' />

  else if(isLoggedIn && ['/sign_in', '/sign_up'].includes(window.location.pathname)) return <Navigate to='/' />
  
  return children;
}

function App() {

  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoutes>
          <Dashboard/>
        </ProtectedRoutes>
      } />
      <Route path='/sign_in' element={
        <ProtectedRoutes>
          <div className="bg-[#e1edff] h-screen flex justify-center items-center">
            <Form isSignInPage={true}/>
          </div>
        </ProtectedRoutes>
      } />
      <Route path='/sign_up' element={
        <ProtectedRoutes>
          <div className="bg-[#e1edff] h-screen flex justify-center items-center">
            <Form isSignInPage={false}/>
          </div>
        </ProtectedRoutes>
      } />
    </Routes>
    
  )
}

export default App
