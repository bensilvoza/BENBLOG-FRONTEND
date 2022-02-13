import * as React from "react";
// MD5 hashing algorithm
import md5 from "../helpers/md5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Cell, ALIGNMENT } from "baseui/layout-grid";
import { AppNavBar } from "baseui/app-nav-bar";
import { H1 } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";

function Register() {
  var [name, setName] = React.useState("");
  var [email, setEmail] = React.useState("");
  var [password, setPassword] = React.useState("");
  var [confirmPassword, setConfirmPassword] = React.useState("");
  var [errorMessage, setErrorMessage] = React.useState(false);

  // protectRoute
  // Protecting the route from unathorized access
  // adding checkpoint in endpoint
  var protectRoute = process.env.REACT_APP_PROTECT_ROUTE;
  const navigate = useNavigate();

  function handleClickBenblog() {
    navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // check if password and confirm password is the same
    if (password !== confirmPassword) {
      setErrorMessage("Password do not match");

      // adding setTimeout
      // setTimeout is asynchronous
      setTimeout(function () {
        return setErrorMessage(false);
      }, 10000);

      // terminate
      return;
    }

    // password length must be 6 characters
    if (password.length <= 5) {
      setErrorMessage("Password must be 6 or more characters");

      // adding setTimeout
      // setTimeout is asynchronous
      setTimeout(function () {
        return setErrorMessage(false);
      }, 10000);

      // terminate
      return;
    }

    // ==========================
    // Communicate to the backend
    // ==========================
    var data = {
      name: name,
      email: email,
      password: md5(password),
    };

    // original address ==> "/register"
    var send = await axios.post(
      `http://localhost:5000/${protectRoute}/register`,
      data
    );

    // user was successfully registered
    if (send["data"] === "User registered") {
      // message to localStorage
      localStorage.setItem("dontStoreSensitiveInformationInlocalStorage", true);

      // one-way storing technique
      localStorage.setItem("accountRegisteredHelper", true);

      navigate("/login");
    }
  }

  function handleClickSignIn() {
    navigate("/login");
  }

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
          {errorMessage !== false && (
            <Notification
              overrides={{
                Body: { style: { width: "auto" } },
              }}
              closeable
              autoHideDuration={10000}
            >
              {errorMessage}
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
              marginTop: "50px",
            },
          },
        }}
      >
        <Cell span={6}>
          <H1>Create account</H1>
          <form onSubmit={handleSubmit}>
            <FormControl label="Name">
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </FormControl>

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
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </FormControl>
            <FormControl label="Confirm Password">
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
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
              CREATE ACCOUNT
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
              onClick={handleClickSignIn}
            >
              SIGN IN
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

export default Register;
