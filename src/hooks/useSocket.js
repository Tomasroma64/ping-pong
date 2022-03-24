import { useState, useEffect } from "react";

function useSocket(endpoint, toSend) {
  const [orientation, acceleration] = toSend;

  const [socketState, setSocketState] = useState("not connected");
  const [websocket, setWebsocket] = useState();
  const [ping, setPing] = useState(null);

  const [newOrientation, setNewOrientation] = useState({
    x: null,
    y: null,
    z: null,
  });
  const [newAcceleration, setNewAcceleration] = useState({
    x: null,
    y: null,
    z: null,
  });

  useEffect(() => {
    setWebsocket(new WebSocket(endpoint));
  }, []);

  useEffect(() => {
    try {
      websocket.onopen = () => {
        console.log("connected");
        setSocketState("connected");
      };
      websocket.onclose = () => {
        setSocketState("connection lost");
      };
      websocket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        setNewOrientation(parsedData["orientation"]);
        setNewAcceleration(parsedData["acceleration"]);
        setPing(new Date().getTime() - parsedData["timestamp"]);
      };
    } catch (e) {
      console.log(e);
    }
  }, [websocket]);

  useEffect(() => {
    try {
      const toSend = {
        orientation: orientation,
        acceleration: acceleration,
        timestamp: new Date().getTime(),
      };
      websocket.send(JSON.stringify(toSend));
    } catch (e) {
      console.log("tried");
    }
  }, [orientation, acceleration]);

  return [socketState, newOrientation, newAcceleration, ping];
}

export default useSocket;
