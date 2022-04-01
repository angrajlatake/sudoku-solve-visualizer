import React from "react";
import { useStopwatch } from "react-timer-hook";

function MyStopwatch({ startTimer }) {
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: true });

  return (
    <div style={{ textAlign: "center" }}>
      <div style={isRunning ?{ fontSize: "2rem" }:{fontWeight: "lighter"}} onClick={isRunning ? pause : start}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

export default function Timer() {
  return (
    <div>
      <MyStopwatch />
    </div>
  );
}
