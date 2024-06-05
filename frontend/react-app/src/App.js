import React from 'react';
import Signup from './pages/signup';
import Signin from './pages/signin';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My App</h1>
        <Signin />
      </header>
    </div>
  );
}

export default App;
