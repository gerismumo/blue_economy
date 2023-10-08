import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
