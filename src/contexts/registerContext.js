import * as React from "react";

export const RegisterContext = React.createContext();

function RegisterContextProvider(props) {
  var [accountCreated, setAccountCreated] = React.useState(false);

  function handleAccountCreated() {
    setAccountCreated(true);

    // adding setTimeout
    // setTimeout is asynchronous
    setTimeout(function () {
      return setAccountCreated(false);
    }, 10000);
  }

  return (
    <RegisterContext.Provider
      value={{
        accountCreated: accountCreated,
        handleAccountCreated: handleAccountCreated,
      }}
    >
      {props.children}
    </RegisterContext.Provider>
  );
}

export default RegisterContextProvider;
