import React from "react";
import { useStopwatch } from "react-timer-hook";

function MyStopwatch({ timeFunction }) {
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: true });

  return (
    <div style={{ textAlign: "center" }}>
      <div style={isRunning ?{ fontSize: "2rem" }:{fontWeight: "lighter"}} onClick={isRunning ? pause : start}>
        <span className="hours">{hours}</span>:<span className="minutes">{minutes}</span>:<span className="seconds">{seconds}</span>
      </div>
    </div>
  );
}

export default function Timer({timeFunction}) {
  return (
    <div>
      <MyStopwatch timeFunction ={timeFunction} />
    </div>
  );
}
