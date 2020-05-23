import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { addNewRecipe } from "../redux/actions/recipeActions";
import {
  TextField,
  Grid,
  Typography,
  Button,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import { connect } from "react-redux";
import { validateRecipe } from "../utils/validateNewRecipe";

const useStyles = makeStyles(theme => ({
  content: {
    marginTop: "95px",
    paddingTop: "50px"
  },
  newTitle: {
    display: "flex",
    justifyContent: "center"
  },
  newImage: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px"
  },
  tableContainer: {
    marginTop: "30px",
    textAlign: "center"
  },
  textContainers: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    margin: "10px"
  },
  submitButton: {
    marginTop: "20px",
    textAlign: "center"
  },
  error: {
    textAlign: "center",
    color: "orange"
  },
  success: {
    textAlign: "center",
    color: "green"
  }
}));

const AddRecipe = props => {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [ingred, setIngred] = useState([]);
  const [direct, setDirect] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTitle = e => {
    setError(false);
    setSuccess(false);
    setTitle(e.target.value);
  };
  const handleEditImage = () => {
    const imageInput = document.querySelector("#imageInput");
    imageInput.click();
  };

  const handleImageChange = e => {
    const image = e.target.files[0];
    if (image.type === "image/png" || image.type === "image/jpeg") {
      const formData = new FormData();
      formData.append("image", image, image.name);
      setImage(formData);
    }
  };

  const addIngred = () => {
    setError(false);
    setSuccess(false);
    const arr = [...ingred];
    arr.push("");
    setIngred(arr);
  };

  const addDirect = () => {
    setError(false);
    setSuccess(false);
    const arr = [...direct];
    arr.push("");
    setDirect(arr);
  };

  const handleChange = (e, i) => {
    if (e.target.name === "ing") {
      const temp = [...ingred];
      temp[i] = e.target.value;
      setIngred(temp);
    } else if (e.target.name === "dir") {
      const temp = [...direct];
      temp[i] = e.target.value;
      setDirect(temp);
    }
  };

  const handleDelete = (type, index) => {
    if (type === "ing") {
      const temp = [...ingred];
      temp.splice(index, 1);
      setIngred(temp);
    } else if (type === "dir") {
      const temp = [...direct];
      temp.splice(index, 1);
      setDirect(temp);
    }
  };

  const handleSubmit = () => {
    const result = validateRecipe(title, image, ingred, direct);
    if (!result.valid) setError(true);
    else {
      props
        .addNewRecipe(title, image, ingred, direct)
        .then(() => {
          setTitle("");
          setIngred([]);
          setDirect([]);
          setImage("");
          setSuccess(true);
        })
        .catch(err => console.log(err));
    }
  };

  const ingredUI = () => {
    return ingred.map((ing, i) => {
      return (
        <div
          key={`${ingred.length}.${i}`}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <IconButton onClick={e => handleDelete("ing", i)}>
            <CloseIcon />
          </IconButton>
          <TextField
            key={i}
            name="ing"
            size="small"
            defaultValue={ing}
            variant="outlined"
            fullWidth
            autoFocus
            autoComplete="off"
            onChange={e => handleChange(e, i)}
            style={{ paddingTop: "5px" }}
          />
        </div>
      );
    });
  };

  const directUI = () => {
    return direct.map((dir, i) => {
      return (
        <div
          key={`${direct.length}.${i}`}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <IconButton onClick={e => handleDelete("dir", i)}>
            <CloseIcon />
          </IconButton>
          <TextField
            name="dir"
            key={i}
            size="medium"
            defaultValue={dir}
            variant="outlined"
            multiline
            fullWidth
            autoFocus
            onChange={e => handleChange(e, i)}
            style={{ paddingTop: "5px" }}
          />
        </div>
      );
    });
  };

  return (
    <>
      <Navbar />
      <div className={classes.content}>
        <div className={classes.newTitle}>
          <TextField
            size="medium"
            placeholder="Recipe Name"
            onChange={e => handleTitle(e)}
            value={title}
          />
        </div>
        <div className={classes.newImage}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEditImage}
          >
            Upload Image
          </Button>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            hidden="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div className={classes.tableContainer}>
          <Grid container>
            <Grid item xs={12} sm={5} md={4} lg={6}>
              <div className={classes.textContainers}>
                <Typography variant="h4">Ingredients</Typography>
                {ingredUI()}
              </div>
              <Button variant="contained" color="secondary" onClick={addIngred}>
                Add
              </Button>
            </Grid>
            <Grid item xs={12} sm={7} md={8} lg={6}>
              <div className={classes.textContainers}>
                <Typography variant="h4">Directions</Typography>
                {directUI()}
              </div>
              <Button variant="contained" color="secondary" onClick={addDirect}>
                Add
              </Button>
            </Grid>
          </Grid>
        </div>
        <div className={classes.submitButton}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            ADD RECIPE
          </Button>
        </div>
        {error ? (
          <div className={classes.error}>Error uploading new recipe</div>
        ) : (
          ""
        )}
        {success ? <div className={classes.success}>Success!</div> : ""}
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = { addNewRecipe };

export default connect(mapStateToProps, mapDispatchToProps)(AddRecipe);
