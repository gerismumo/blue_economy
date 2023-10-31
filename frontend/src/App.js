
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

import AdminPage from './components/AdminPage';
import CyberSec from './components/CyberSec';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';
import Submit from './components/Submit';
import Verify from './components/Verify';
import UploadFile from './components/UploadFile';
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/feedback' element={<Submit />} />
        <Route path='/dashboard' element={<Dashboard/>} /> 
        <Route path='/adminPage' element={<AdminPage/>} />
        <Route path='/cyberSecurity' element={<CyberSec />} />
        <Route path='/registration' element={<RegistrationForm/>} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/uploadFile' element={<UploadFile />} />
    
        
        {/* <Route
          path="/adminPage"
          element={
            <ProtectedRoute element={<AdminPage />} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute element={<Dashboard />} />
          }
        /> */}
      </Routes>
    </Router>
  );
}


export default App;
