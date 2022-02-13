import * as React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Cell } from "baseui/layout-grid";
import { Avatar } from "baseui/avatar";
import { AppNavBar } from "baseui/app-nav-bar";
import { Card, StyledBody } from "baseui/card";
import { H1, H2, Label2, Paragraph1, Paragraph2 } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";

function Post() {
  var [post, setPost] = React.useState({});
  // default value index 0
  var [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  var { id } = useParams();

  // protectRoute
  // Protecting the route from unathorized access
  // adding checkpoint in endpoint
  var protectRoute = process.env.REACT_APP_PROTECT_ROUTE;

  const navigate = useNavigate();

  function handleClickSelectImage(address) {
    for (var i = 0; i < post["uploadedFile"].length; i++) {
      if (post["uploadedFile"][i]["path"] === address) {
        return setCurrentImageIndex(i);
      }
    }
  }

  function handleClickEdit() {
    navigate("/post/edit/" + id);
  }

  React.useEffect(async function () {
    // original address ==> "/post/:id"
    var getData = await axios.get(
      `http://localhost:5000/${protectRoute}/post/` + id
    );

    setPost(getData["data"]);
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                display: "inline",
                marginBottom: "1px",
                fontFamily: "Montserrat",
                color: "gray",
              }}
            >
              {post["title"]}
            </h1>
            <span
              style={{
                color: "gray",
                fontSize: "30px",
                paddingTop: "20px",
                cursor: "pointer",
              }}
              onClick={handleClickEdit}
            >
              &#9998;
            </span>
          </div>
          <Paragraph2 color={"gray"} marginTop={"2px"} marginBottom={"2px"}>
            {post["date"]} &#8226; {post["readTime"]}
          </Paragraph2>
        </Cell>

        {post["uploadedFile"] !== undefined && (
          <Cell
            overrides={{
              Cell: {
                style: {
                  marginTop: "10px",
                },
              },
            }}
            span={8}
          >
            <Card
              overrides={{
                Root: {
                  style: {
                    paddingTop: "17px",
                    paddingLeft: "17px",
                    paddingRight: "17px",
                  },
                },
                Body: {
                  style: {
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: "0",
                    margin: "0",
                  },
                },
                Contents: {
                  style: {
                    padding: "0",
                    margin: "0",
                  },
                },
              }}
              headerImage={post["uploadedFile"][currentImageIndex]["path"]}
            >
              <StyledBody>
                {post["uploadedFile"].map((uploadedFileRender) => (
                  <Paragraph1
                    onClick={function () {
                      handleClickSelectImage(uploadedFileRender["path"]);
                    }}
                    marginRight={"4px"}
                    display={"inline"}
                  >
                    &#9634;
                  </Paragraph1>
                ))}
              </StyledBody>
            </Card>
          </Cell>
        )}

        <Cell
          overrides={{
            Cell: {
              style: {
                marginTop: "5px",
              },
            },
          }}
          span={8}
        >
          <Paragraph1>{post["description"]}</Paragraph1>
        </Cell>
      </Grid>

      <br />
      <br />
      <br />
    </>
  );
}

export default Post;
