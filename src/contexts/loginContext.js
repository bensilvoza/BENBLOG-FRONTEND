import * as React from "react";

export const LoginContext = React.createContext();

function LoginContextProvider(props) {
  var [user, setUser] = React.useState(undefined);
  var [authenticated, setAuthenticated] = React.useState(false);

  function handleUser(name) {
    setUser(name);
  }
  // handle user mate
  var handleUserMate = handleUser;

  function handleAuthenticated() {
    if (authenticated === false) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }

  return (
    <LoginContext.Provider
      value={{
        user: user,
        authenticated: authenticated,
        handleUserMate: handleUserMate,
        handleAuthenticated: handleAuthenticated,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
}

export default LoginContextProvider;
