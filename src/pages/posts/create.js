import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Cell } from "baseui/layout-grid";
import { AppNavBar } from "baseui/app-nav-bar";
import { H1 } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Accordion, Panel } from "baseui/accordion";
import { FileUploader } from "baseui/file-uploader";
import { Card } from "baseui/card";
import { Textarea } from "baseui/textarea";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";
import { Spinner } from "baseui/spinner";

// rich text editor
import { Editor } from "@tinymce/tinymce-react";

// CONTEXT
import { CreatePostSubmitContext } from "../../contexts/createPostSubmitContext";

function Create() {
  var [title, setTitle] = React.useState("");
  var [date, setDate] = React.useState("");
  // time to read
  var [readTime, setReadTime] = React.useState("");
  // uploaded file
  var [uploadedFile, setUploadedFile] = React.useState([]);
  var [description, setDescription] = React.useState("");
  var [postCreated, setPostCreated] = React.useState(false);
  var [currentSelectedImage, setCurrentSelectedImage] = React.useState("");

  // rich text editor

  // ENV
  // protectRoute
  // Protecting the route from unathorized access
  // adding checkpoint in endpoint
  var protectRoute = process.env.REACT_APP_PROTECT_ROUTE;
  // rich text editor
  // Tiny Cloud
  var tinyCloudKey = process.env.REACT_APP_TINYCLOUD_KEY;

  // navigate ...
  const navigate = useNavigate();

  // CONTEXT
  //  var { timer } = React.useContext(TimerContext);
  var { handleSendPostMate, successMessage, progress, loading } =
    React.useContext(CreatePostSubmitContext);

  // ============
  // uploadedFile
  // ============
  function handleMouseEnterFile(filenameData) {
    setCurrentSelectedImage(filenameData);
  }

  function handleMouseLeaveFile() {
    setCurrentSelectedImage("");
  }

  function handleClickDeleteFile(filenameData) {
    var uploadedFileCreateCopy = [...uploadedFile];
    for (var i = 0; i < uploadedFile.length; i++) {
      if (uploadedFile[i]["name"] === filenameData) {
        uploadedFileCreateCopy.splice(i, 1);
        return setUploadedFile(uploadedFileCreateCopy);
      }
    }
  }

  function handleClickBenblog() {
    navigate("/");
  }

  function handleClickCancel() {
    navigate("/");
  }

  // rich text editor

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading === true) {
      return;
    }

    // if time to read is empty
    var readTimeValue;
    if (readTime === "") {
      readTimeValue = "1 min read";
    } else {
      readTimeValue = readTime;
    }

    var post = {
      title: title,
      date: date,
      readTime: readTimeValue,
      uploadedFile: uploadedFile,
      description: description,
    };

    // mate of handleSendPost
    // if function has a parameter
    // save the function to a variable
    // CONTEXT
    handleSendPostMate(post);
  }

  React.useEffect(async function () {
    // get current date
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var dd = String(today.getDate()).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = "February" + " " + dd + ", " + yyyy;
    setDate(today);
  }, []);

  // CONTEXT
  React.useEffect(
    async function () {
      if (successMessage === "Post successfully created") {
        // scroll window to top
        window.scrollTo(0, 0);

        setTitle("");
        setReadTime("");
        setUploadedFile([]);
        setDescription("");
      }
    },
    [successMessage]
  );

  console.log(description);

  return (
    <>
      {/* Notification for uploading files */}
      {loading === true && (
        <span style={{ position: "fixed", bottom: "0", right: "0" }}>
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
        <Cell span={8}>
          {successMessage && (
            <Notification
              overrides={{
                Body: { style: { width: "auto" } },
              }}
              closeable
            >
              {successMessage}
            </Notification>
          )}
        </Cell>
      </Grid>
      {/* End of notification */}

      <form onSubmit={handleSubmit}>
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
          <Cell span={8}>
            <H1>Create post</H1>
            <FormControl label="Title">
              <Input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </FormControl>
          </Cell>

          <Cell span={12}></Cell>

          <Cell span={4}>
            <Input
              overrides={{
                Input: {
                  style: {
                    color: "gray",
                  },
                },
              }}
              type="text"
              value={date}
              onChange={(e) => setDate(e.currentTarget.value)}
            />
          </Cell>

          <Cell span={4}>
            <Input
              type="text"
              placeholder="5 min read"
              value={readTime}
              onChange={(e) => setReadTime(e.currentTarget.value)}
            />
          </Cell>

          <Cell span={8}>
            <FormControl label="Add image">
              <FileUploader
                multiple
                name="uploadedFile"
                onDrop={function (acceptedFiles) {
                  // ...
                  var uploadedFileCopy = [...uploadedFile];
                  uploadedFileCopy.push(acceptedFiles[0]);
                  setUploadedFile(uploadedFileCopy);
                }}
              />
            </FormControl>
          </Cell>

          <Cell span={12}></Cell>

          {uploadedFile.map((showUploadedFile) => (
            <Cell span={2}>
              <Card
                overrides={{
                  Root: {
                    style: {
                      paddingTop: "15px",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                    },
                  },
                  Body: {
                    style: {
                      display: "flex",
                      justifyContent: "center",
                      padding: "0",
                      margin: "0",
                    },
                  },
                  Contents: {
                    style: {
                      padding: "0",
                      margin: "5px",
                    },
                  },
                  HeaderImage: { style: { height: "auto" } },
                }}
                headerImage={URL.createObjectURL(showUploadedFile)}
                onMouseEnter={function () {
                  handleMouseEnterFile(showUploadedFile["name"]);
                }}
                onMouseLeave={handleMouseLeaveFile}
              >
                {currentSelectedImage === showUploadedFile["name"] && (
                  <span
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={function () {
                      handleClickDeleteFile(showUploadedFile["name"]);
                    }}
                  >
                    DELETE
                  </span>
                )}
              </Card>
            </Cell>
          ))}

          <Cell span={12}></Cell>

          <Cell span={8}>
            <FormControl label="Description">
              <Editor
                apiKey={tinyCloudKey}
                initialValue=""
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image",
                    "charmap print preview anchor help",
                    "searchreplace visualblocks code",
                    "insertdatetime media table paste wordcount",
                  ],
                  toolbar:
                    "formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | undo redo | help",
                }}
                onChange={function (e) {
                  setDescription(e.target.getContent());
                }}
              />
            </FormControl>
            <Button
              overrides={{
                BaseButton: {
                  style: {
                    marginRight: "10px",
                  },
                },
              }}
              kind={KIND.secondary}
              onClick={handleClickCancel}
            >
              CANCEL
            </Button>
            <Button type="submit">
              {loading === false ? (
                "PUBLISH"
              ) : (
                <>
                  <Spinner
                    overrides={{
                      ActivePath: {
                        style: { fill: "white" },
                      },
                      Svg: {
                        style: {
                          width: "20px",
                          height: "16px",
                        },
                      },
                    }}
                  />
                  <span style={{ marginLeft: "5px" }}>Please wait...</span>
                </>
              )}
            </Button>
          </Cell>
        </Grid>
      </form>

      <br />
      <br />
      <br />
    </>
  );
}

export default Create;
