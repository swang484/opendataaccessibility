import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [domain, setDomain] = useState('');
  const [code, setCode] = useState('');
  const [question, setQuestion] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example: just combine inputs (replace with real API call)
    setOutput(`Domain: ${domain}\nCode: ${code}\nQuestion: ${question}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title"><b>Open Data Accessibility Project</b></h1>
        <form className="App-form" onSubmit={handleSubmit}>
          <input
            className="App-input"
            type="text"
            placeholder="Domain (e.g. data.cityofnewyork.us)"
            value={domain}
            onChange={e => setDomain(e.target.value)}
          />
          <input
            className="App-input"
            type="text"
            placeholder="Code (e.g. vx8i-nprf)"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <input
            className="App-input"
            type="text"
            placeholder="Question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
          <button className="App-button" type="submit">Submit</button>
        </form>
        <div className="App-output-container">
          <pre className="App-output">{output}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;