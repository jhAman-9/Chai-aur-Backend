# Created My First Backend Server :

        import express from "express";

        const app = express();

        app.get("/", (req, res) => {
        res.send("Server is Ready and Started");
        });
        app.get("/api/jokes", (req, res) => {


            <!-- const jokes = [
                {
                    id: 1,
                    name: '1st joke',
                    content: "this is first joke"
                },
                {
                    id: 2,
                    name: '2nd joke',
                    content: "this is second joke"
                },
                {
                    id: 3,
                    name: '3rd joke',
                    content: "this is third joke"
                },
                {
                    id: 4,
                    name: '4th joke',
                    content: "this is fourth joke"
                },
                {
                    id: 5,
                    name: '5th joke',
                    content: "this is fifth joke"
                }
            ] -->
<!-- 
            const  jokes =  -->
            
            res.send(jokes);
        });

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
        console.log(`Serve at http:localhost:${port}`);
        });




# frontend Part :

- for the create react app process the proxy is setup in packeage.json file
        
          "proxy": "http://localhost:4000", 

- for vite app setup the proxy in vite.config.js

        server: {
            proxy: {
            '/api' : 'http://localhost:3000',
            }
        },


- Then fetching the data of the backend server that I have created

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