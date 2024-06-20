// src/App.js
import React from 'react';
import './App.css';
import Questionnaire from './Questionaire';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenidos a nuestra boda</h1>
        <Questionnaire />
      </header>
    </div>
  );
}

export default App;
