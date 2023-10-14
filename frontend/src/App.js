import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Submit from './components/Submit';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/feedback' element={<Submit />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
