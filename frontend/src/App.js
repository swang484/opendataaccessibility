import React, { useState } from 'react';
import logo from './logo.svg';
import axios from 'axios'
import './App.css';

function App() {
  const [domain, setDomain] = useState('');
  const [code, setCode] = useState('');
  const [question, setQuestion] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/convertSQL', {
        domain,
        code,
        question
      });
      setOutput(response.data);
      console.log(response.data);
    } catch (error) {
      setOutput({ error: error.message });
    }
  };

  // Helper: is output an array of objects?
  const isTableData = Array.isArray(output) &&
    output.length > 0 &&
    typeof output[0] === 'object' &&
    !Array.isArray(output[0]);

  let headers = [];
  if (isTableData) {
    headers = Object.keys(output[0]);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p></p>
        <img src={"https://opendata.cityofnewyork.us/wp-content/themes/opendata-wp/assets/img/nyc-open-data-logo.svg"} className="App-logo" alt="logo" />
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
          <div>Result</div>
          {isTableData ? (
            <table>
              <thead>
                <tr>
                  {headers.map((header) => <th key={header}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {output.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map((header) => (
                      <td key={header}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : output && (
            <pre className="App-output">
              {typeof output === "object" ? JSON.stringify(output, null, 2) : output}
            </pre>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;