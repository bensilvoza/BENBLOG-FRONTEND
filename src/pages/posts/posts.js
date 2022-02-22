import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Cell } from "baseui/layout-grid";
import { Avatar } from "baseui/avatar";
import { AppNavBar } from "baseui/app-nav-bar";
import {
  H1,
  H2,
  Label2,
  Label4,
  Paragraph1,
  Paragraph2,
} from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";
import { Spinner } from "baseui/spinner";

// CONTEXT
// import { TimerContext } from "../../contexts/timerContext";
import { CreatePostSubmitContext } from "../../contexts/createPostSubmitContext";
import { LoginContext } from "../../contexts/loginContext";

function Posts() {
  var [posts, setPosts] = React.useState([]);
  var [mouseEnter, setMouseEnter] = React.useState(false);
  var [currentTitle, setCurrentTitle] = React.useState("");
  var [query, setQuery] = React.useState("");
  var [searchBox, setSearchBox] = React.useState(false);

  // CONTEXT
  //  var { timer } = React.useContext(TimerContext);
  var { loading, progress } = React.useContext(CreatePostSubmitContext);
  var { user, authenticated, handleUserMate, handleAuthenticated } =
    React.useContext(LoginContext);

  // protectRoute
  // Protecting the route from unathorized access
  // adding checkpoint in endpoint
  var protectRoute = process.env.REACT_APP_PROTECT_ROUTE;

  const navigate = useNavigate();

  function handleMouseEnter(currTitle) {
    setCurrentTitle(currTitle);
    setMouseEnter(true);
  }

  function handleMouseLeave() {
    setMouseEnter(false);
  }

  function handleClickTitle(id) {
    navigate("/post/" + id);
  }

  function handleClickCreate() {
    if (user === undefined) {
      navigate("/login");
    } else {
      navigate("/posts/create");
    }
  }

  function handleClickLogout() {
    // localStorage
    localStorage.setItem("user", undefined);
    localStorage.setItem("authenticated", false);
    // CONTEXT
    // why save function to variable,
    // to use the function as a storage
    // not to execute, call or trigger
    // the function
    if (user !== undefined) {
      // if no user is logged in
      handleUserMate(undefined);
      var handleAuthenticatedMateLocal = handleAuthenticated;
      handleAuthenticatedMateLocal();
    }
    // END, CONTEXT

    navigate("/login");
  }

  function handleClickSearchIcon() {
    if (searchBox === true) {
      setSearchBox(false);
      setQuery("");
    } else {
      setSearchBox(true);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    var postsCopy = [...posts];
    for (var i = 0; i < postsCopy.length; i++) {
      if (postsCopy[i]["title"].toLowerCase().includes(query.toLowerCase())) {
        postsCopy.unshift(postsCopy[i]);
        postsCopy.splice(i + 1, 1);
        break;
      }
    }

    setPosts(postsCopy);
  }

  React.useEffect(async function () {
    // original address ==> "/"
    var getData = await axios.get(`http://localhost:5000/${protectRoute}`);
    setPosts(getData["data"]);
  }, []);

  return (
    <>
      {/* Notification for uploading files */}
      {loading === true && (
        <span
          style={{ position: "fixed", bottom: "0", right: "0", margin: "5px" }}
        >
          <Notification closeable>
            <span style={{ marginRight: "10px" }}>
              <Spinner size="20px" color="black" />
            </span>
            <span>{progress}% Please wait...</span>
          </Notification>
        </span>
      )}
      {/* End, Notification for uploading files */}

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
        <Cell span={8}>
          <div>
            <h1
              style={{
                cursor: "pointer",
                marginBottom: "1px",
                fontFamily: "Montserrat",
                color: "gray",
                display: "inline",
              }}
            >
              BENBLOG
            </h1>
          </div>

          <br />
          <br />
          <div style={{ display: "flex" }}>
            <Avatar
              name="Ben"
              size="scale1600"
              src="https://res.cloudinary.com/benblog-cloudinary/image/upload/v1644640435/BENBLOG/fznp3albdblpcr7qrc3h.jpg"
            />
            <Paragraph1
              color={"gray"}
              as={"span"}
              marginLeft={"10px"}
              display={"inline"}
            >
              Hello my name is Ben <br /> Status Update: Currently hungry 🍞🍺
            </Paragraph1>
          </div>
        </Cell>
      </Grid>

      <br />

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
        <Cell span={8}>
          <div style={{ display: "inline" }}>
            <p
              style={{
                display: "inline",
                fontFamily: "Open Sans",
                fontSize: "25px",
                fontWeight: "100",
                color: "gray",
                marginRight: "20px",
                cursor: "pointer",
              }}
              onClick={handleClickCreate}
            >
              <i class="bi bi-plus-square"></i>
              Create
            </p>
            <p
              style={{
                display: "inline",
                fontFamily: "Open Sans",
                fontSize: "25px",
                fontWeight: "100",
                color: "gray",
                marginRight: "20px",
                cursor: "pointer",
              }}
              onClick={handleClickSearchIcon}
            >
              <i class="bi bi-search"></i>
              Search
            </p>

            <p
              style={{
                display: "inline",
                fontFamily: "Open Sans",
                fontSize: "25px",
                fontWeight: "100",
                color: "gray",
                cursor: "pointer",
              }}
              onClick={handleClickLogout}
            >
              <i class="bi bi-archive"></i>
              LOGOUT
            </p>
          </div>
          {searchBox && (
            <form onSubmit={handleSearchSubmit}>
              <Input
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                placeholder="search here"
              />
            </form>
          )}
        </Cell>

        <Cell span={8}>
          {posts.map((p) => (
            <>
              <h1
                style={{
                  cursor: "pointer",
                  marginBottom: "1px",
                  fontFamily: "Montserrat",
                  color:
                    mouseEnter && currentTitle === p["title"]
                      ? "black"
                      : "gray",
                }}
                onMouseEnter={function () {
                  return handleMouseEnter(p["title"]);
                }}
                onMouseLeave={handleMouseLeave}
                onClick={function () {
                  handleClickTitle(p["_id"]);
                }}
              >
                {p["title"]}
              </h1>

              <Paragraph2 color={"gray"} marginTop={"2px"} marginBottom={"2px"}>
                {p["date"]} &#8226; {p["readTime"]}
              </Paragraph2>
              <Label2>
                {p["description"].replace(/<[^>]+>/g, "").substr(0, 300)}
              </Label2>
              <br />
            </>
          ))}
        </Cell>
      </Grid>

      <br />
      <br />
      <br />
      <br />
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <span
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Paragraph1 as={"span"} color={"gray"}>
            Designed and built with all the love, @Ben
          </Paragraph1>
        </span>
      </div>
    </>
  );
}

export default Posts;
