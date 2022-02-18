import * as React from "react";
import axios from "axios";

export const CreatePostSubmitContext = React.createContext();

function CreatePostSubmitContextProvider(props) {
  // context is originated from
  // ../pages/posts/create

  var [loading, setLoading] = React.useState(false);
  var [successMessage, setSuccessMessage] = React.useState(false);
  var [progress, setProgress] = React.useState(0);

  // protectRoute
  // Protecting the route from unathorized access
  // adding checkpoint in endpoint
  var protectRoute = process.env.REACT_APP_PROTECT_ROUTE;

  async function handleSendPost(post) {
    setLoading(true);

    let formData = new FormData();
    formData.append("title", post["title"]);
    formData.append("date", post["date"]);
    formData.append("readTime", post["readTime"]);
    formData.append("description", post["description"]);
    for (let i = 0; i < post["uploadedFile"].length; i++) {
      formData.append(`uploadedFile`, post["uploadedFile"][i]);
    }
    // formData.append("uploadedFile", uploadedFile[0]);
    formData.append("author", localStorage.getItem("user"));

    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 50
        );
        setProgress(progress);
      },
    };

    var send = await axios.post(
      `http://localhost:5000/${protectRoute}/posts/create`,
      formData,
      config
    );

    if (send["data"] === "Post created") {
      setLoading(false);
      setSuccessMessage("Post successfully created");

      // adding setTimeout
      // setTimeout is asynchronous
      setTimeout(function () {
        return setSuccessMessage(false);
      }, 5000);
    }
  }
  // mate of handleSendPost
  // if function has a parameter
  // save the function to a variable
  var handleSendPostMate = handleSendPost;

  return (
    <CreatePostSubmitContext.Provider
      value={{
        handleSendPostMate: handleSendPostMate,
        successMessage: successMessage,
        progress: progress,
        loading: loading,
      }}
    >
      {props.children}
    </CreatePostSubmitContext.Provider>
  );
}

export default CreatePostSubmitContextProvider;
