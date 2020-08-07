import React from "react";
import "./Post.style.css";
import Avatar from "@material-ui/core/Avatar";

function Post({ username, imageUrl, caption }) {
  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          src="https://scontent.fhel1-1.fna.fbcdn.net/v/t1.0-9/s960x960/107742644_3291644484191098_555466327727393101_o.jpg?_nc_cat=109&_nc_sid=85a577&_nc_ohc=DhBWh0wNo-8AX_AHcaQ&_nc_ht=scontent.fhel1-1.fna&_nc_tp=7&oh=4b9f141f38760f4ea1e97f3aab7638df&oe=5F501529"
        />
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
