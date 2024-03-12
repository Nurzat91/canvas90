import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import crypto from 'crypto';
import {ActiveConnections, Draws, IncomingMessage} from "./types";



const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const router = express.Router();


let draws: Draws[];

const activeConnections: ActiveConnections = {};
router.ws('/draw', (ws, req) => {
  const id = crypto.randomUUID();
  console.log('client connected id=', id);
  activeConnections[id] = ws;


  ws.on('message', (message) =>{
    console.log(message.toString());
    const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;

    if (parsedMessage.type === 'SEND_DRAWS'){
      const data = parsedMessage.payload as Draws[];
      draws.push(...data);

      Object.keys(activeConnections).forEach(id => {
        const conn = activeConnections[id];
        const outgoingMsg = {type: 'NEW_DRAWS', payload: draws};
        conn.send(JSON.stringify(outgoingMsg));
      });
    }
  });

  ws.on('close', () =>{
    console.log('client disconnected id=', id);
    delete activeConnections[id];
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});