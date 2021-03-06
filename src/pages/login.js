import * as React from "react";
// MD5 hashing algorithm
import md5 from "../helpers/md5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Cell } from "baseui/layout-grid";
import { AppNavBar } from "baseui/app-nav-bar";
import { H1 } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";

// CONTEXT
import { LoginContext } from "../contexts/loginContext";
import { RegisterContext } from "../contexts/registerContext";
//import { TimerContext } from "../contexts/timerContext";

function Login() {
  var [users, setUsers] = React.useState([]);
  var [email, setEmail] = React.useState("");
  var [password, setPassword] = React.useState("");
  var [accountRegistered, setAccountRegistered] = React.useState(false);

  // CONTEXT
  // var { timer } = React.useContext(TimerContext);
  var { handleUserMate, handleAuthenticated } = React.useContext(LoginContext);
  var { accountCreated } = React.useContext(RegisterContext);

  // protectRoute
  // Protecting the route from unathorized access
  // adding checkpoint in endpoint
  var protectRoute = process.env.REACT_APP_PROTECT_ROUTE;
  const navigate = useNavigate();

  function handleClickCreateAccount() {
    navigate("/register");
  }

  function handleClickBenblog() {
    navigate("/");
  }

  /*
  // if a function needs a parameter
  function handleUserMateLocal(name){
    handleUserMate(name);
  }

  <button onClick={function () {
    handleUserMateLocal(Math.random());
  }}> click me </button>
  */

  function handleSubmit(e) {
    e.preventDefault();
    for (var i = 0; i < users.length; i++) {
      if (users[i]["email"] === email) {
        if (users[i]["password"] === md5(password)) {
          localStorage.setItem("user", users[i]["name"]);
          localStorage.setItem("authenticated", true);
          // CONTEXT
          // why save function to variable,
          // to use the function as a storage,
          // not to execute call or trigger
          // the function
          handleUserMate(users[i]["name"]);
          var handleAuthenticatedMateLocal = handleAuthenticated;
          handleAuthenticatedMateLocal();
          // END, CONTEXT
          navigate("/");
        } else {
          navigate("/login");
        }
      }
    }
  }

  React.useEffect(async function () {
    // // one-way storing technique
    // // account succesfully registered
    // if (JSON.parse(localStorage.getItem("accountRegisteredHelper")) === true) {
    //   setAccountRegistered(true);
    // } else {
    //   setAccountRegistered(false);
    // }
    // localStorage.setItem("accountRegisteredHelper", false);
    // // end, account succesfully registered

    // communicate to backend and get all users
    // original address ==> "/register"
    var getUsers = await axios.get(
      `http://localhost:5000/${protectRoute}/register`
    );
    setUsers(getUsers["data"]);
  }, []);

  return (
    <>
      <Grid
        overrides={{
          Grid: {
            style: {
              display: "flex",
              justifyContent: "center",
            },
          },
        }}
      >
        <Cell span={6}>
          <h1
            style={{
              cursor: "pointer",
              marginBottom: "1px",
              fontFamily: "Montserrat",
              color: "gray",
            }}
            onClick={handleClickBenblog}
          >
            BENBLOG
          </h1>
        </Cell>
      </Grid>

      {/* Notification */}
      <Grid
        overrides={{
          Grid: {
            style: {
              display: "flex",
              justifyContent: "center",
            },
          },
        }}
      >
        <Cell span={6}>
          {accountCreated && (
            <Notification
              overrides={{
                Body: { style: { width: "auto" } },
              }}
              closeable
              autoHideDuration={10000}
            >
              {function () {
                return "Account successfully registered";
              }}
            </Notification>
          )}
        </Cell>
      </Grid>
      {/* End of notification */}

      <Grid
        overrides={{
          Grid: {
            style: {
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            },
          },
        }}
      >
        <Cell span={6}>
          <H1>Sign in</H1>
          <form onSubmit={handleSubmit}>
            <FormControl label="Email">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </FormControl>

            <FormControl label="Password">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </FormControl>
            <Button
              overrides={{
                BaseButton: {
                  style: {
                    width: "100%",
                    marginBottom: "5px",
                  },
                },
              }}
              type="submit"
            >
              SIGN IN
            </Button>

            <Button
              overrides={{
                BaseButton: {
                  style: {
                    width: "100%",
                  },
                },
              }}
              kind={KIND.secondary}
              onClick={handleClickCreateAccount}
            >
              CREATE ACCOUNT
            </Button>
          </form>
        </Cell>
      </Grid>
      <br />
      <br />
      <br />
    </>
  );
}

export default Login;
