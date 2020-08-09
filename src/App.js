import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import Profile from "./Profile";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { Input } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openUploadImage, setOpenUploadImage] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubcribe();
    };
  }, [user]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({ displayName: username });
      })
      .then(alert("Sign Up successfully"))
      .catch((error) => alert(error.message));
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert("Sign In error"));
    setOpenSignIn(false);
    setEmail("");
    setPassword("");
  };

  const signOut = (event) => {
    event.preventDefault();
    auth.signOut();
  };
  return (
    <div className="App">
      <Modal open={openUploadImage} onClose={() => setOpenUploadImage(false)}>
        <div style={modalStyle} className={classes.paper}>
          {user?.displayName ? (
            <ImageUpload user={user} username={user.displayName} />
          ) : (
            <ImageUpload user={user} username={username} />
          )}
        </div>
      </Modal>
      <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app_header_img"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/128px-Instagram_logo.svg.png"
              alt="instagram"
            ></img>
          </center>
          <Profile user={user}></Profile>
        </div>
      </Modal>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup" onSubmit={signUp}>
            <center>
              <img
                className="app_header_img"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/128px-Instagram_logo.svg.png"
                alt="instagram"
              ></img>
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup" onSubmit={signIn}>
            <center>
              <img
                className="app_header_img"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/128px-Instagram_logo.svg.png"
                alt="instagram"
              ></img>
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app_header_img"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/128px-Instagram_logo.svg.png"
          alt="instagram"
        ></img>
        {user ? (
          <div>
            <Button onClick={() => setOpenProfile(true)}>Profile</Button>
            <Button onClick={() => setOpenUploadImage(true)}>
              Upload Image
            </Button>
            <Button onClick={signOut}>Sign Out</Button>
          </div>
        ) : (
          <div className="app_login_container">
            <div>Sign In to Upload Image</div>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app_post_container">
        <div className="app_post">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              avatar={post.userAvatar}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
