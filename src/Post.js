import React, { useState, useEffect } from "react";
import "./Post.style.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase";

function Post({ postId, user, username, imageUrl, caption }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (postId) {
      const unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
      return () => {
        unsubscribe();
      };
    }
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

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
      <div className="post_comment">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong>
            &nbsp;{comment.text}
          </p>
        ))}
      </div>
      {user ? (
        <form className="post_form" onSubmit={postComment}>
          <input
            className="post_input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></input>
          <button
            className="post_button"
            type="submit"
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      ) : (
        ""
      )}
    </div>
  );
}
export default Post;
