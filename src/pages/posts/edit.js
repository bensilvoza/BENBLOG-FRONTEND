import * as React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Cell } from "baseui/layout-grid";
import { AppNavBar } from "baseui/app-nav-bar";
import { H1, Paragraph1 } from "baseui/typography";
import Delete from "baseui/icon/delete";
import { FormControl } from "baseui/form-control";
import { Accordion, Panel } from "baseui/accordion";
import { FileUploader } from "baseui/file-uploader";
import { Card, StyledBody } from "baseui/card";
import { Textarea } from "baseui/textarea";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";
import { Spinner } from "baseui/spinner";

function Edit() {
  var [title, setTitle] = React.useState("");
  var [date, setDate] = React.useState("");
  // time to read
  var [readTime, setReadTime] = React.useState("");
  // uploaded file
  var [uploadedFile, setUploadedFile] = React.useState([]);
  // uploadedFile original copy
  var [uploadedFileOriginal, setUploadedFileOriginal] = React.useState([]);
  var [description, setDescription] = React.useState("");
  var { id } = useParams();
  var [postUpdated, setPostUpdated] = React.useState(false);
  var [currentSelectedImage, setCurrentSelectedImage] = React.useState("");

  // protectRoute
  // Protecting the route from unathorized access
  // adding checkpoint in endpoint
  var protectRoute = process.env.REACT_APP_PROTECT_ROUTE;

  // publish loading icon
  var [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  // ====================
  // uploadedFileOriginal
  // ====================
  function handleMouseEnterFileOriginal(filenameData) {
    setCurrentSelectedImage(filenameData);
  }

  function handleMouseLeaveFileOriginal() {
    setCurrentSelectedImage("");
  }

  function handleClickDeleteFileOriginal(filenameData) {
    var uploadedFileOriginalCreateCopy = [...uploadedFileOriginal];
    for (var i = 0; i < uploadedFileOriginal.length; i++) {
      if (uploadedFileOriginal[i]["filename"] === filenameData) {
        uploadedFileOriginalCreateCopy.splice(i, 1);
        return setUploadedFileOriginal(uploadedFileOriginalCreateCopy);
      }
    }
  }

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

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    // if time to read is empty
    var readTimeValue;
    if (readTime === "") {
      readTimeValue = "1 min read";
    } else {
      readTimeValue = readTime;
    }

    let formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("readTime", readTime);
    formData.append("description", description);
    // string, in order for the backend easier to read
    var uploadedFileOriginalintoString = "";
    for (var i = 0; i < uploadedFileOriginal.length; i++) {
      uploadedFileOriginalintoString =
        uploadedFileOriginalintoString + uploadedFileOriginal[i]["filename"];

      if (i + 1 !== uploadedFileOriginal.length) {
        uploadedFileOriginalintoString = uploadedFileOriginalintoString + " ";
      }
    }

    formData.append("uploadedFileOriginal", uploadedFileOriginalintoString);
    for (let i = 0; i < uploadedFile.length; i++) {
      formData.append(`uploadedFile`, uploadedFile[i]);
    }
    // formData.append("uploadedFile", uploadedFile[0]);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    var send = await axios.post(
      `http://localhost:5000/${protectRoute}/post/edit/` + id,
      formData,
      config
    );

    if (send["data"] === "Post updated") {
      navigate("/post/" + id);
    }
  }

  React.useEffect(async function () {
    var getPost = await axios.get(
      `http://localhost:5000/${protectRoute}/post/edit/` + id
    );

    setTitle(getPost["data"]["title"]);
    setDate(getPost["data"]["date"]);
    setReadTime(getPost["data"]["readTime"]);
    setUploadedFileOriginal(getPost["data"]["uploadedFile"]);
    setDescription(getPost["data"]["description"]);
  }, []);

  console.log(uploadedFile);

  return (
    <>
      <AppNavBar title="BENBLOG" />
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
          {postUpdated && (
            <Notification
              overrides={{
                Body: { style: { width: "auto" } },
              }}
              closeable
              autoHideDuration={5000}
            >
              {function () {
                return "Post successfully updated";
              }}
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

          {uploadedFileOriginal.map((showUploadedFileOriginal) => (
            <Cell key={showUploadedFileOriginal["filename"]} span={2}>
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
                onMouseEnter={function () {
                  handleMouseEnterFileOriginal(
                    showUploadedFileOriginal["filename"]
                  );
                }}
                onMouseLeave={handleMouseLeaveFileOriginal}
                headerImage={showUploadedFileOriginal["path"]}
              >
                {currentSelectedImage ===
                  showUploadedFileOriginal["filename"] && (
                  <span
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={function () {
                      handleClickDeleteFileOriginal(
                        showUploadedFileOriginal["filename"]
                      );
                    }}
                  >
                    DELETE
                  </span>
                )}
              </Card>
            </Cell>
          ))}

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
                onMouseEnter={function () {
                  handleMouseEnterFile(showUploadedFile["name"]);
                }}
                onMouseLeave={handleMouseLeaveFile}
                headerImage={URL.createObjectURL(showUploadedFile)}
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
              <Textarea
                overrides={{
                  InputContainer: {
                    style: {
                      height: "500px",
                    },
                  },
                }}
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
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
            >
              CANCEL
            </Button>
            <Button type="submit">
              {loading === false ? (
                "PUBLISH"
              ) : (
                <>
                  <Spinner
                    title="Please wait"
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
                  <span style={{ marginLeft: "5px" }}>Please wait</span>
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

export default Edit;
