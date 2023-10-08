import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
