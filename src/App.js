import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import useSocket from "./hooks/useSocket";
import useSensors from "./hooks/useSensors";
const ENDPOINT = "wss://pingpong.tomasmaillo.com:8080";

function App() {
  const [orientation, acceleration] = useSensors();
  const [socketState, newOrientation, newAcceleration, ping] = useSocket(
    ENDPOINT,
    [orientation, acceleration]
  );

  const getPerms = () => {
    DeviceMotionEvent.requestPermission().then((response) => {
      if (response == "granted") {
        console.log("Got them perms babes!");
      } else {
        alert(response);
      }
    });
  };

  return (
    <>
      <button onClick={getPerms}>getPerms</button>
      <p>
        Socket: {socketState} {ping}ms
      </p>
      <p>
        {newOrientation["x"]} {newOrientation["y"]} {newOrientation["z"]}
      </p>
      <p>
        {newAcceleration["x"]} {newAcceleration["y"]} {newAcceleration["z"]}
      </p>
      <Canvas dpr={[1, 2]}>
        <ambientLight intensity={0.1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box
          acceleration={newAcceleration}
          position={[0, 1.5, 0]}
          newRot={
            new THREE.Vector3(
              (newOrientation["y"] * Math.PI) / 180,
              (newOrientation["z"] * Math.PI) / 180,
              (newOrientation["x"] * Math.PI) / 180
            )
          }
        />
      </Canvas>
    </>
  );
}

function lerp(start, end, t) {
  const endVariants = [end - Math.PI, end, end + Math.PI];

  const closestEnd = endVariants.reduce((a, b) => {
    return Math.abs(b - start) < Math.abs(a - start) ? b : a;
  });

  let lerpVal = (1 - t) * start + t * closestEnd;

  return lerpVal;
}

function Box({ acceleration, newRot }) {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.x = lerp(ref.current.rotation.x, newRot["x"], 0.1);
    ref.current.rotation.y = lerp(ref.current.rotation.y, newRot["y"], 0.1);
    ref.current.rotation.z = lerp(ref.current.rotation.z, newRot["z"], 0.1);

    ref.current.position.lerp(acceleration, 0.1);
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 3, 0.1]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

export default App;
