import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [joke, setJokes] = useState([]);

  useEffect(() => {
    axios.get('/api/jokes')
      .then((response) => {
        setJokes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="container">
        <h1>Hello</h1>
        <p>Total Jokes = {joke.length}</p>
        {
          joke.map((joke) => (
            <div key={joke.id}>
              <h2>{joke.title}</h2>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default App;
