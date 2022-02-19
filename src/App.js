import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Posts from "./pages/posts/posts";
import CreatePost from "./pages/posts/create";
import Post from "./pages/posts/post";
import EditPost from "./pages/posts/edit";
import TimerContextProvider from "./contexts/timerContext";
import CreatePostSubmitContextProvider from "./contexts/createPostSubmitContext";
import LoginContextProvider from "./contexts/loginContext";

function App() {
  return (
    <div>
      <BrowserRouter>
        <LoginContextProvider>
          <CreatePostSubmitContextProvider>
            <TimerContextProvider>
              <Routes>
                <Route exact path="/" element={<Posts />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/posts/create" element={<CreatePost />} />
                <Route exact path="/post/:id" element={<Post />} />
                <Route exact path="/post/edit/:id" element={<EditPost />} />
              </Routes>
            </TimerContextProvider>
          </CreatePostSubmitContextProvider>
        </LoginContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
