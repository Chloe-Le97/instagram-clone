import React from "react";
import "./Post.style.css";
import Avatar from "@material-ui/core/Avatar";

function Post({ username, imageUrl, caption }) {
  return (
    <div className="post">
      <div className="post_header">
        <Avatar className="post_avatar" />
        <h3>{username}</h3>
      </div>

      <img className="post_img" src={imageUrl}></img>
      <h4 className="post_text">
        <strong>{username}</strong>
        &nbsp;{caption}
      </h4>
    </div>
  );
}
export default Post;
