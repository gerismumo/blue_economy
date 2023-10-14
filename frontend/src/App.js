import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminPage from './components/AdminPage';
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
        {/* <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/adminPage' element={<AdminPage/>} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
