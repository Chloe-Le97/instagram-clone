import React, { useState, useEffect } from "react";
import "./Post.style.css";
import Avatar from "@material-ui/core/Avatar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { db } from "./firebase";
import firebase from "firebase";
import "./Post.style.css";

function Post({ postId, user, username, imageUrl, caption, avatar }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState([]);

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
      const unsubscribe2 = db
        .collection("posts")
        .doc(postId)
        .collection("likes")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setLikes(snapshot.docs.map((doc) => doc.data()));
        });

      return () => {
        unsubscribe();
        unsubscribe2();
      };
    }
  }, [postId]);

  useEffect(() => {
    if (user) {
      const unsubscribe3 = db
        .collection("posts")
        .doc(postId)
        .collection("likes")
        .doc(user.uid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setLike(true);
          } else {
            setLike(false);
          }
        });
      // return () => {
      //   unsubscribe3();
      // };
    }
  }, [postId, user]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  const notLike = (event) => {
    alert("Sign In to like this post");
  };
  const likeAction = async (event) => {
    if (!like) {
      await db
        .collection("posts")
        .doc(postId)
        .collection("likes")
        .doc(user.uid)
        .set({
          likestate: !like,
          userId: user.uid,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      setLike(!like);
    } else {
      db.collection("posts")
        .doc(postId)
        .collection("likes")
        .doc(user.uid)
        .delete()
        .then(setLike(!like));
    }
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar className="post_avatar" src={avatar} />
        <h3>{username}</h3>
      </div>

      <img className="post_img" src={imageUrl}></img>
      <div className="post_likes">
        {user ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={like}
                onChange={likeAction}
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                name="checked"
              />
            }
          />
        ) : (
          <FormControlLabel
            control={
              <Checkbox
                checked={false}
                onChange={notLike}
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                name="checked"
              />
            }
          />
        )}
        {likes.length > 1 ? (
          <div className="post_like">
            Liked by
            {likes.map((like,index) => (
              <div className='like_by'>
              {index==likes.length-1?(<>&nbsp;and<strong>&nbsp;{like.username}</strong></>):(<><strong>&nbsp;{like.username},</strong></>)}
              </div>
            ))}
          </div>
        ) : likes.length == 1?(<>Liked by <strong>&nbsp;{likes[0].username}</strong></> ): (
          "Be the first one to like"
        )}
      </div>
      <h4 className="post_text">
        <strong>{username}</strong>
        &nbsp;{caption}
      </h4>
      <div className="post_comment_container">
        {comments.map((comment) => (
          <div className="post_comment">
            <strong>{comment.username}</strong>
            &nbsp;{comment.text}
          </div>
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
