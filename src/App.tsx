import React, { useState } from 'react';
import './App.css';

import Header from './Header';

function App() {
  const [counter, setCounter] = useState(0); // [valor do estado, func para att]

  function handleClick() {
    setCounter(counter + 1);
  }

  return (
    <div>
      <Header title={`Ecoleta ${counter}`} />

      <h1>{counter}</h1>
      <button type="button" onClick={handleClick}>Clique aqui</button>
    </div>
  );
}

export default App;
