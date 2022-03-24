import { useState, useEffect } from "react";

function useSensors() {
  const [orientation, setOrientation] = useState({
    x: null,
    y: null,
    z: null,
  });
  const [acceleration, setAcceleration] = useState({
    x: null,
    y: null,
    z: null,
  });

  // TODO: this eventlistener shouldnt need useEffect hook
  useEffect(() => {
    window.addEventListener("deviceorientation", (event) => {
      // Decimals after two decimal points fluctuate even when not moving phone
      const readings = {
        x: event.alpha.toFixed(2),
        y: event.beta.toFixed(2),
        z: event.gamma.toFixed(2),
      };

      setOrientation({ ...readings });
    });

    window.addEventListener("devicemotion", (event) => {
      // Decimals after two decimal points fluctuate even when not moving phone
      const readings = {
        x: event.acceleration.x.toFixed(2),
        y: event.acceleration.y.toFixed(2),
        z: event.acceleration.z.toFixed(2),
      };

      setAcceleration({ ...readings });
    });
  }, []);

  return [orientation, acceleration];
}

export default useSensors;
