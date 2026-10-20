import './App.css';
import {Routes,Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import {ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login';

function App() {
  return (
   <>
   <ToastContainer/>
   <Routes>
    <Route path='/' element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>
   </Routes>
   </>
  );
}
export function ProtectedRoutes(props){
  if(localStorage.getItem('user') && localStorage.getItem('token')){
    return props.children
  }
  else{
    return <Navigate to='/login'/>
  }
}
export default App;
