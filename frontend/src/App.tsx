import {useEffect, useRef, useState} from 'react'
import {Typography} from "@mui/material";
import Canvas from "./components/Canvas";
import {ChatDraws, IncomingChatMessage} from "./types";

function App() {
  const [draw, setDraw] = useState<ChatDraws[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/draw');
    ws.current.addEventListener('close', () => console.log('ws closed'));
    ws.current.addEventListener('message', (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingChatMessage;
      if (decodedMessage.type === 'NEW_DRAWS') {
        setDraw((dots) => dots.concat(decodedMessage.payload));
      }
    });
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    }
  }, []);


  const onDraw = (data: ChatDraws) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    ws.current.send(JSON.stringify({
      type: 'SEND_DRAWS',
      payload: [{
        dotX: data.dotX,
        dotY: data.dotY,
      }]
    }));
  };


  return (
    <>
      <Typography variant='h2' textAlign='center'>You can draw here</Typography>
      <Canvas painted={draw} onDraw={onDraw}/>
    </>
  )
}

export default App