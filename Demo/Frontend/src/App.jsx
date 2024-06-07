import { useEffect, useState } from "react";
import "./App.css";
import axios from 'axios'

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios.get("/api/jokes")
      .then((response) => {
      setJokes(response.data)
      })
      .catch((error) => {
      console.log(error);
    })
  },[])

  return (
    <div>
      <h1>Backend Started</h1>
      <p>Jokes : {jokes.length}</p>

      {jokes.map((jokes) => (
        <div key={jokes.id}>
          <h3>{jokes.name}</h3>
          <p>{jokes.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
