import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Cell } from "baseui/layout-grid";
import { Avatar } from "baseui/avatar";
import { AppNavBar } from "baseui/app-nav-bar";
import { H1, H2, Label2, Paragraph1, Paragraph2 } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";

function Posts() {
  var [posts, setPosts] = React.useState([]);
  var [mouseEnter, setMouseEnter] = React.useState(false);
  var [currentTitle, setCurrentTitle] = React.useState("");

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

  React.useEffect(async function () {
    // original address ==> "/"
    var getData = await axios.get(`http://localhost:5000/${protectRoute}`);

    setPosts(getData["data"]);
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
        <Cell span={8}>
          <h1
            style={{
              cursor: "pointer",
              marginBottom: "1px",
              fontFamily: "Montserrat",
              color: "gray",
            }}
          >
            BENBLOG
          </h1>

          <br />
          <br />
          <div style={{ display: "flex" }}>
            <Avatar
              name="Jane Doe"
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
                  return handleClickTitle(p["_id"]);
                }}
              >
                {p["title"]}
              </h1>

              <Paragraph2 color={"gray"} marginTop={"2px"} marginBottom={"2px"}>
                {p["date"]} &#8226; {p["readTime"]}
              </Paragraph2>
              <Label2>{p["description"].substr(0, 300)}</Label2>
              <br />
            </>
          ))}
        </Cell>
      </Grid>

      <br />
      <br />
      <br />
    </>
  );
}

export default Posts;
