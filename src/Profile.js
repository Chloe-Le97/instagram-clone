import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import "./Profile.css";
import EditIcon from "@material-ui/icons/Edit";

function Profile({ user }) {
  const [username, setUsername] = useState(user.displayName);
  const [avatar, setAvatar] = useState(user.photoURL);
  const [uploadMenu, setUploadMenu] = useState(false);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const changeUsername = async (event) => {
    event.preventDefault();
    await user.updateProfile({
      displayName: `${username}`,
    });
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const changeAvatar = (event) => {
    event.preventDefault();
    setUploadMenu(true);
  };

  const upload = async (event) => {
    event.preventDefault();
    const uploadTask = storage.ref(`avatar/${image.name}`).put(image);

    await uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        alert("error.message");
      },
      async () => {
        // complete function
        await storage
          .ref("avatar")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setAvatar(URL.createObjectURL(image));
            user.updateProfile({
              photoURL: url,
            });
            setProgress(0);
            setImage(null);
            setUploadMenu(false);
          });
      }
    );
  };
  const handleChangeUserName = (event) => {
    event.preventDefault();
    document.getElementById("profile_input").focus();
  };
  return (
    <div className="profile">
      <center>
        <Avatar className="profile_avatar" src={`${avatar}`} />
        <Button onClick={changeAvatar}>Change Profile Photo</Button>
        {uploadMenu ? (
          <div>
            <progress
              className="imageUpload_progress"
              value={progress}
              max="100"
            />
            <input type="file" onChange={handleChange} />
            <Button onClick={upload}>Upload</Button>
          </div>
        ) : (
          ""
        )}
      </center>
      <form onSubmit={changeUsername}>
        <label>
          <strong>Username</strong>&nbsp;
          <EditIcon
            className="profile_edit_btn"
            style={{ fontSize: 20 }}
            onClick={handleChangeUserName}
          />
        </label>
        <input
          id="profile_input"
          className="profile_input"
          placeholder="New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
      </form>
      <p>
        <strong>Email</strong>
      </p>
      <p>{user.email}</p>
      <p>
        <strong>Create at</strong>
      </p>
      <p>{user.metadata.creationTime}</p>
    </div>
  );
}
export default Profile;
