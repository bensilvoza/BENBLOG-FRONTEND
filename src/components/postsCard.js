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

function PostsCard(props) {
  return (
    <>
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
      <br />
      <br />
    </>
  );
}

export default PostsCard;
