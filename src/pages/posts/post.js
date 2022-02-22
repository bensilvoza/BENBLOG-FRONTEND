import * as React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Cell } from "baseui/layout-grid";
import { AppNavBar } from "baseui/app-nav-bar";
import { Card, StyledBody } from "baseui/card";
import { H1, H2, Label2, Paragraph1, Paragraph2 } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification, KIND as NOTIFICATIONKIND } from "baseui/notification";
import { Spinner } from "baseui/spinner";
import Avatar from "react-avatar";
import Comment from "../../components/comment";

// HTML parser
import parse from "html-react-parser";

// CONTEXT
// import { TimerContext } from "../../contexts/timerContext";
import { CreatePostSubmitContext } from "../../contexts/createPostSubmitContext";
import { LoginContext } from "../../contexts/loginContext";

function Post() {
  var [post, setPost] = React.useState({});
  var [currentImageIndex, setCurrentImageIndex] = React.useState(undefined);
  var { id } = useParams();

  // comment
  var [comment, setComment] = React.useState("");
  var [comments, setComments] = React.useState([]);
  var [currentParentCommentId, setCurrentParentCommentId] = React.useState("");
  var [childComment, setChildComment] = React.useState("");
  var [commentError, setCommentError] = React.useState(false);
  var [editCommentId, setEditCommentId] = React.useState("");

  // ref
  const myRef = React.useRef(null);
  const executeScroll = () => myRef.current.scrollIntoView();

  // CONTEXT
  //  var { timer } = React.useContext(TimerContext);
  var { loading, progress } = React.useContext(CreatePostSubmitContext);
  var { user } = React.useContext(LoginContext);

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

  async function handleClickDelete() {
    // delete post
    await axios.get(`http://localhost:5000/${protectRoute}/post/delete/` + id);
    navigate("/");
  }

  function handleClickBenblog() {
    navigate("/");
  }

  function handleClickComment(commentId) {
    if (commentId === currentParentCommentId) {
      setCurrentParentCommentId("");
    } else {
      setCurrentParentCommentId(commentId);
    }
  }

  function handleClickEditComment(itemId) {
    if (editCommentId == itemId) {
      setEditCommentId("");
    } else {
      setEditCommentId(itemId);
    }
  }

  async function handleSubmitComment(e, commentData) {
    e.preventDefault();

    if (user === undefined) {
      setCommentError(true);

      var executeScrollMate = executeScroll;
      executeScrollMate();

      // adding setTimeout
      // setTimeout is asynchronous
      setTimeout(function () {
        return setCommentError(false);
      }, 5000);

      // terminate
      return;
    }

    if (commentData["relationship"] === "parent") {
      // create a copy
      // use spread operator
      var commentsCopy = [...comments];
      commentsCopy.push([commentData]);

      setComments(commentsCopy);
    } else {
      // create a copy
      // use spread operator
      var commentsCopy = [...comments];

      for (var i = 0; i < commentsCopy.length; i++) {
        if (commentsCopy[i][0]["commentId"] === commentData["commentId"]) {
          commentsCopy[i].push(commentData);
        }
      }
      setComments(commentsCopy);
    }
    setComment("");
    setChildComment("");
    setCurrentParentCommentId("");
  }

  React.useEffect(async function () {
    // original address ==> "/post/:id"
    var getData = await axios.get(
      `http://localhost:5000/${protectRoute}/post/` + id
    );
    setPost(getData["data"]);

    var getCommentData = await axios.get(
      `http://localhost:5000/${protectRoute}/comment/${id}`
    );
    setComments(getCommentData["data"]);
  }, []);

  React.useEffect(
    async function () {
      if (Object.keys(post).length !== 0) {
        if (post["uploadedFile"].length !== 0) {
          setCurrentImageIndex(0);
        }
      }
    },
    [post]
  );

  React.useEffect(
    async function () {
      if (comments.length !== 0) {
        // submit comments to the backend
        // original address ==> "/createupdate"
        var sendData = await axios.post(
          `http://localhost:5000/${protectRoute}/comment/createupdate`,
          { postId: id, comments: comments }
        );

        console.log("");
      }
    },
    [comments]
  );

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
            {localStorage.getItem("user") === post["author"] && (
              <span
                style={{
                  color: "lightgray",
                  fontSize: "30px",
                  paddingTop: "20px",
                }}
              >
                <span style={{ cursor: "pointer" }} onClick={handleClickEdit}>
                  &#9998;
                </span>
                <span
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onClick={handleClickDelete}
                >
                  <i class="bi bi-trash"></i>
                </span>
              </span>
            )}
          </div>
          <Paragraph2 color={"gray"} marginTop={"2px"} marginBottom={"2px"}>
            {post["date"]} &#8226; {post["readTime"]}
          </Paragraph2>
        </Cell>

        {currentImageIndex !== undefined && (
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
          <Paragraph1>{parse(String(post["description"]))}</Paragraph1>
        </Cell>
      </Grid>

      <br />
      <br />

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
          <span
            ref={myRef}
            style={{
              fontFamily: "Open Sans",
              fontSize: "30px",
              fontWeight: "900",
            }}
          >
            Responses
          </span>

          {/* Notification for uploading files */}
          {commentError && (
            <Notification kind={NOTIFICATIONKIND.negative} closeable>
              <span> Must be log in first</span>
            </Notification>
          )}
          {/* End, Notification for uploading files */}
        </Cell>

        <Cell span={12}></Cell>
        <Cell span={6}>
          {comments.map((commentArray) => (
            <>
              {commentArray.map((c) => (
                <>
                  <span
                    style={{
                      fontFamily: "Roboto",
                      color: "black",
                    }}
                  >
                    {c["relationship"] === "parent" ? (
                      <p
                        style={{
                          marginBottom: "10px",
                          marginTop: "80px",
                        }}
                      >
                        <p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span style={{ display: "flex" }}>
                              <span>
                                <Avatar
                                  size="50"
                                  round={true}
                                  src={`https://avatars.dicebear.com/api/micah/${c["user"]}.svg`}
                                />
                              </span>
                              <p
                                style={{
                                  fontFamily: "Open Sans",
                                  alignSelf: "end",
                                  margin: "0",
                                  marginLeft: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                {c["user"].toUpperCase().substr(0, 15)} <br />{" "}
                                now &#8226; Public
                              </p>
                            </span>
                            {c["user"] === user && (
                              <span
                                style={{
                                  color: "lightgray",
                                  display: "flex",
                                  alignItems: "end",
                                }}
                              >
                                <span
                                  onClick={function () {
                                    handleClickEditComment(c["itemId"]);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <i className="bi bi-pen"></i>
                                </span>
                                <span
                                  style={{
                                    marginLeft: "15px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </span>
                              </span>
                            )}
                          </div>
                        </p>
                        {c["itemId"] == editCommentId ? (
                          <Textarea
                            overrides={{
                              Input: {
                                style: {
                                  height: "200px",
                                  backgroundColor: "white",
                                },
                              },
                            }}
                            value={c["body"]}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        ) : (
                          c["body"]
                        )}
                      </p>
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "end",
                        }}
                      >
                        <p
                          style={{
                            marginTop: "0",
                            width: "90%",
                            backgroundColor: "#F2F3F5",
                            padding: "10px",
                            borderRadius: "10px",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "10px",
                            }}
                          >
                            <span>
                              <div
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                <span>
                                  <Avatar
                                    size="50"
                                    round={true}
                                    src={`https://avatars.dicebear.com/api/micah/${c["user"]}.svg`}
                                  />
                                </span>
                                <p
                                  style={{
                                    fontFamily: "Open Sans",
                                    display: "inline",
                                    margin: "0",
                                    marginLeft: "15px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {c["user"].toUpperCase().substr(0, 15)} <br />{" "}
                                  now &#8226; Public
                                </p>
                              </div>
                            </span>
                            {c["user"] === user && (
                              <span
                                style={{
                                  color: "lightgray",
                                  display: "flex",
                                  alignItems: "end",
                                }}
                              >
                                <span
                                  onClick={function () {
                                    handleClickEditComment(c["itemId"]);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <i className="bi bi-pen"></i>
                                </span>
                                <span
                                  style={{
                                    marginLeft: "15px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </span>
                              </span>
                            )}
                          </span>

                          {c["itemId"] == editCommentId ? (
                            <Textarea
                              overrides={{
                                Input: {
                                  style: {
                                    height: "200px",
                                    backgroundColor: "white",
                                  },
                                },
                              }}
                              value={c["body"]}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          ) : (
                            c["body"]
                          )}
                        </p>
                      </span>
                    )}

                    {c["relationship"] === "parent" && (
                      <span
                        style={{
                          display: "flex",
                          alignContent: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <span style={{ marginRight: "30px", color: "gray" }}>
                          <i
                            style={{ color: "pink", fontSize: "20px" }}
                            className="bi bi-heart-fill"
                          ></i>
                        </span>
                        <span
                          onClick={function () {
                            handleClickComment(commentArray[0]["commentId"]);
                          }}
                          style={{ color: "gray", cursor: "pointer" }}
                        >
                          Reply
                        </span>
                      </span>
                    )}
                  </span>

                  {currentParentCommentId === commentArray[0]["commentId"] &&
                    c["relationship"] === "parent" && (
                      <form
                        onSubmit={function (e) {
                          handleSubmitComment(e, {
                            relationship: "child",
                            commentId: commentArray[0]["commentId"],
                            itemId: Math.round(Math.random() * 1000001),
                            body: childComment,
                            user: user,
                            userPhoto: `https://avatars.dicebear.com/api/micah/${user}.svg`,
                          });
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            margin: "10px",
                          }}
                        >
                          {" "}
                          <input
                            placeholder="Write a comment"
                            value={childComment}
                            onChange={function (e) {
                              setChildComment(e.target.value);
                            }}
                            style={{
                              width: "90%",
                              padding: "10px",
                              borderRadius: "20px",
                              border: "1px solid gray",
                            }}
                          />
                        </span>
                      </form>
                    )}
                </>
              ))}
            </>
          ))}
        </Cell>

        <Cell span={12}></Cell>

        <br />
        <br />
        <br />

        <Cell span={6}>
          <form
            onSubmit={function (e) {
              handleSubmitComment(e, {
                relationship: "parent",
                commentId: Math.round(Math.random() * 1000001),
                itemId: Math.round(Math.random() * 1000001),
                body: comment,
                user: user,
                userPhoto: `https://avatars.dicebear.com/api/micah/${user}.svg`,
              });
            }}
          >
            <Comment
              value={comment}
              onChange={(e) => setComment(e.currentTarget.value)}
            />
          </form>
        </Cell>
      </Grid>

      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default Post;
