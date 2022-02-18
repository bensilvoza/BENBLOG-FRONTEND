import * as React from "react";

// CONTEXT
export const TimerContext = React.createContext();

function TimerContextProvider(props) {
  var [timer, setTimer] = React.useState(0);

  // adding setTimeout
  // setTimeout is asynchronous
  setTimeout(function () {
    var timerCopy = timer;
    setTimer(timerCopy + 1);
  }, 1000);

  return (
    <TimerContext.Provider value={{ timer: timer }}>
      {props.children}
    </TimerContext.Provider>
  );
}

export default TimerContextProvider;
