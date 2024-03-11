import React, {useEffect, useRef, useState} from 'react'
import {Typography} from "@mui/material";
import Canvas from "./components/Canvas";
import {ChatDraws, IncomingChatMessage} from "./types";

function App() {
  const [draw, setDraw] = useState<ChatDraws[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [usernameText, setUsernameText] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/draw');
    ws.current.addEventListener('close', () => console.log('ws closed'));
    ws.current.addEventListener('message', (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingChatMessage;
      if (decodedMessage.type === 'NEW_DRAWS') {
        setDraw((dots) => dots.concat(decodedMessage.payload));
      }
      if(decodedMessage.type === 'WELCOME'){
        console.log(decodedMessage.payload);
      }
    });
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    }
  }, []);


  const onDraw = (data: ChatDraws) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify({
      type: 'SEND_DRAWS',
      payload: [{
        dotX: data.dotX,
        dotY: data.dotY,
      }]
    }));
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) return;
    setUsername(usernameText);
    if (!ws.current) return;
    ws.current.send(JSON.stringify({ type: 'SET_USERNAME', payload: usernameText }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameText(e.target.value);
  };

  return (
    <>
      <Typography variant='h2' textAlign='center'>You can draw here</Typography>
      <Canvas painted={draw} onDraw={onDraw}/>
      <form onSubmit={handleUsernameSubmit}>
        <input
          type="text"
          name="username"
          value={usernameText}
          onChange={handleUsernameChange}
        />
        <input type="submit" value="Enter Chat" />
      </form>
    </>
  )
}

export default App