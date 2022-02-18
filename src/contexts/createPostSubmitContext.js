import * as React from "react";
import axios from "axios";

export const CreatePostSubmitContext = React.createContext();

function CreatePostSubmitContextProvider(props) {
  // context is originated from
  // ../pages/posts/create

  var [loading, setLoading] = React.useState(false);
  var [postCreatedHelperId, setPostCreatedHelperId] = React.useState(null);
  var [testMe, setTestMe] = React.useState(undefined);

  // protectRoute
  // Protecting the route from unathorized access
  // adding checkpoint in endpoint
  var protectRoute = process.env.REACT_APP_PROTECT_ROUTE;

  function handleTestMe(data) {
    return function () {
      setTestMe(data);
    };
  }

  function handleSendPost(post) {
    return async function () {
      setLoading(post);
      return;
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
      };

      var send = await axios.post(
        `http://localhost:5000/${protectRoute}/posts/create`,
        formData,
        config
      );

      if (send["data"] === "Post created") {
        // Post created helper id
        // no real data
        setPostCreatedHelperId(Math.floor(Math.random() * 1000001));
      }
    };
  }

  React.useEffect(
    async function () {
      if (postCreatedHelperId !== null) {
        setLoading(false);
      }
    },
    [postCreatedHelperId]
  );

  return (
    <CreatePostSubmitContext.Provider
      value={{
        handleSendPost: handleSendPost,
        loading: loading,
        handleTestMe: handleTestMe,
        testMe: testMe,
      }}
    >
      {props.children}
    </CreatePostSubmitContext.Provider>
  );
}

export default CreatePostSubmitContextProvider;
