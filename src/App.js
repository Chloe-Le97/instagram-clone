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
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";

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
    width: 300,
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
  const [repeatpassword, setRepeatPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
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
    if (password == repeatpassword) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          authUser.user.updateProfile({ displayName: username });
        })
        .catch((error) => alert(error.message));

      setOpen(false);
      setEmail("");
      setPassword("");
      setRepeatPassword("");
    } else {
      alert("The repeat password is incorrect");
    }
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
  // const modalWidth = window.innerWidth > 600 ? 400 : 300;
  // classes.paper.width = modalWidth;

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
      <Modal
        open={openProfile}
        className="modal"
        onClose={() => setOpenProfile(false)}
      >
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
      <Modal className="modal" open={open} onClose={() => setOpen(false)}>
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
            <Input
              placeholder="repeat password"
              type="password"
              value={repeatpassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            ></Input>
            <Button
              className="app_form_submit"
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
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
            <Button
              className="app_form_submit"
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
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
          <div className="app_header_btn">
            <Button
              className="app_login_btn"
              variant="outlined"
              color="primary"
              onClick={() => setOpenProfile(true)}
            >
              Profile
            </Button>
            <Button
              className="app_login_btn"
              variant="outlined"
              color="primary"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="app_login_container">
            <Button
              className="app_login_btn"
              variant="outlined"
              color="primary"
              onClick={() => setOpenSignIn(true)}
            >
              Sign In
            </Button>
            <Button
              className="app_login_btn"
              variant="outlined"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

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
      <div className="app_footer">
        <div className="app_footer_btn_container">
          {user ? (
            <IconButton
              className="app_footer_btn"
              color="primary"
              onClick={() => setOpenUploadImage(true)}
            >
              <AddCircleIcon className="app_upload" style={{ fontSize: 50 }} />
            </IconButton>
          ) : (
            <IconButton
              className="app_footer_btn"
              color="primary"
              onClick={() => alert("Please sign in to upload image")}
            >
              <AddCircleIcon className="app_upload" style={{ fontSize: 50 }} />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
