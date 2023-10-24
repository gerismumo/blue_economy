
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

import AdminPage from './components/AdminPage';
import Attend from './components/Attend';
import Confirm from './components/Confirm';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Submit from './components/Submit';
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/feedback' element={<Submit />} />
        <Route path='/dashboard' element={<Dashboard/>} /> 
        <Route path='/adminPage' element={<AdminPage/>} />
        <Route path='/attendData' element={<Attend />} />
        <Route path='/confirmAttend' element={<Confirm />} />
        
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
