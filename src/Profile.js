import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@material-ui/core";
import { storage, db } from "./firebase";
import "./Profile.css";

function Profile({ user }) {
  const [username, setUsername] = useState(user.displayName);
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
  const upload = (event) => {
    const uploadTask = storage.ref(`avatar/${image.name}`).put(image);

    uploadTask.on(
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
      () => {
        // complete function
        storage
          .ref("avatar")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
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

  return (
    <div className="profile">
      <center>
        <Avatar className="profile_avatar" src={`${user.photoURL}`} />
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
      <div>
        <strong>Username</strong>
      </div>
      <form onSubmit={changeUsername}>
        <input
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
