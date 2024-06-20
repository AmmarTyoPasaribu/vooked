import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Home from './pages/home';
import Tables from './pages/restoDetail';
import Tab from './pages/booking';
import Admsignup from './pages/admSignUp';
import Admhome from './pages/admHome';
import AdmsignIn from './pages/admSignIn';
import Admres from './pages/admRes';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/tables/:resto_id" element={<Tables />} />
          <Route path="/table/:resto_id/:table_id" element={<Tab />} />
          <Route path="/admin/register" element={< Admsignup/>} />
          <Route path="/admin/signin" element={< AdmsignIn/>} />
          <Route path="/admin/home" element={< Admhome/>} />
          <Route path="/admin/res" element={< Admres />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
