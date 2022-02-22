import * as React from "react";

import { Grid, Cell } from "baseui/layout-grid";

import { H1 } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";
import { attributesToProps } from "html-react-parser";

function Comment(props) {
  return (
    <>
      <input
        style={{
          width: "100%",
          color: "gray",
          padding: "10px",
          border: "1px solid gray",
          borderRadius: "20px",
          fontSize: "15px",
        }}
        value={props.value}
        onChange={props.onChange}
        type="text"
        required
        placeholder="Write a comment"
      />
    </>
  );
}

export default Comment;
