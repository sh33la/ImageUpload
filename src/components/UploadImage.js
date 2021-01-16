import React from "react";
import { DropzoneArea } from "material-ui-dropzone";
import { Fab, FormControlLabel, Grid, Switch } from "@material-ui/core";
import { AddPhotoAlternate } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import axios from "axios";

import "../App.css";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  button: {
    color: blue[900],
    margin: 10,
  },
}));

function UploadImage() {
  const [state, setState] = React.useState({
    camera: false,
    blur: true,
  });
  const classes = useStyles();
  const [imageFile, setImageFile] = React.useState("");
  const [result, setResult] = React.useState([]);

  const handleSwitch = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleUpload = (event) => {
    // console.log("called", event);
    var file = event.target.files[0];
    const data = new FormData();
    data.append("file", file, file.name);
    // console.log(file);
    // console.log(data);

    let URL = "http://localhost:8082/v1/nsfw";
    axios
      .post(URL, data, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      })
      .then((res) => {
        console.log(res);
        setResult(res.data);
      })
      .catch((error) => {
        console.warn(error);
      });

    setImageFile(URL.createObjectURL(file));
  };

  const resultHeader = (show = false) => {
    let list = [],
      header = "";
    if (show == true) {
      result.forEach((ele) => {
        list.push(ele["probability"]);
      });
      result.forEach((ele) => {
        if (Math.max(...list) == ele["probability"])
          header = "Identified as " + ele["className"];
      });
    }
    return (
      <div>
        {header}
        <hr />
      </div>
    );
  };

  return (
    <div>
      <Grid container spacing={2}>
        {imageFile && (
          <Grid item sm={12}>
            <img
              style={{ maxWidth: "400px", maxHeight: "400px" }}
              src={imageFile}
            />
          </Grid>
        )}

        <Grid item sm={12}>
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            type="file"
            onChange={(event) => handleUpload(event)}
          />
          <label htmlFor="contained-button-file">
            <Fab component="span" className={classes.button}>
              <AddPhotoAlternate />
            </Fab>
          </label>
        </Grid>

        <Grid item sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={state.camera}
                onChange={handleSwitch}
                name="camera"
                color="primary"
              />
            }
            label="Camera"
            labelPlacement="start"
          />
        </Grid>
        <Grid item sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={state.blur}
                onChange={handleSwitch}
                name="blur"
                color="primary"
              />
            }
            label="Blur Protection"
            labelPlacement="start"
          />
        </Grid>
        <Grid item sm={12}>
          <hr />
          {result.length != 0 ? (
            <div>
              {resultHeader(true)}
              {result.map((item) => (
                <div>
                  <label className="App-link">
                    {item["className"]}:{" "}
                    {(item["probability"] * 100).toFixed(2)}%{" "}
                  </label>
                  <br />
                </div>
              ))}
            </div>
          ) : (
            "Ready to Classify"
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default UploadImage;
