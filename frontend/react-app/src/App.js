import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Home from './pages/home';
import Tables from './pages/restoDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/tables/:resto_id" element={<Tables />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
