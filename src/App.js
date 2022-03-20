import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function useGyro() {
  const [angularVelocity, setAngularVelocity] = useState({
    x: null,
    y: null,
    z: null,
  });

  // TODO: this eventlistener shouldnt need useEffect hook
  useEffect(() => {
    window.addEventListener("deviceorientation", (event) => {
      const readings = {
        x: event.alpha,
        y: event.beta,
        z: event.gamma,
      };

      setAngularVelocity({ ...readings });
    });
  }, []);

  return angularVelocity;
}

function App() {
  const gyro = useGyro();

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
      <p>{gyro["x"]}</p>
      <p>{gyro["y"]}</p>
      <p>{gyro["z"]}</p>
      <Canvas dpr={[1, 2]}>
        <ambientLight intensity={0.1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box
          position={[0, 1.5, 0]}
          rotation={[
            (gyro["z"] * Math.PI) / 180,
            (gyro["y"] * Math.PI) / 180,
            (gyro["x"] * Math.PI) / 180,
          ]}
        />
      </Canvas>
    </>
  );
}

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default App;
