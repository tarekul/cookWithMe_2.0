import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  IconButton,
  TextField,
  Tooltip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import CloseIcon from "@material-ui/icons/Close";
import AddBoxIcon from "@material-ui/icons/AddBox";
import EditIcon from "@material-ui/icons/Edit";

import Navbar from "../components/Navbar";

import RecipeCard from "../components/RecipeCard";

import { connect } from "react-redux";
import {
  loadFavorites,
  loadGroceries,
  updateGroceries,
  uploadImage,
  updateName
} from "../redux/actions/userActions";
import { selectRecipe } from "../redux/actions/recipeActions";

const useStyles = makeStyles(theme => ({
  content: {
    marginTop: "95px"
  },
  profileImage: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "50%"
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    padding: "5%"
  },
  userInfo: {
    marginLeft: "27px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  editButton: {
    padding: 0,
    width: "5px"
  },
  textStyle: {
    fontFamily: "Playfair display,sans-serif",
    color: "grey"
  },
  favGroceryContainer: {},
  groceryList: {
    listStyle: "circle",
    color: "grey",
    fontFamily: "Roboto,sans serif",
    fontSize: "20px",
    paddingLeft: "20px"
  },
  txtFldAlign: {
    marginLeft: "5%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  addDoneButton: {
    marginLeft: "5%"
  },
  skeletonDivOne: {
    width: "50%",
    height: "2vh",
    backgroundColor: "grey",
    marginLeft: "10px",
    marginTop: "10px"
  },
  skeletonDivTwo: {
    width: "30%",
    height: "1.5vh",
    backgroundColor: "darkgray",
    marginLeft: "10px",
    marginTop: "10px"
  },
  skeletonDivThree: {
    width: "20%",
    height: "1vh",
    backgroundColor: "black",
    marginLeft: "10px",
    marginTop: "10px"
  },
  imageWrapper: {
    position: "relative",
    "& Button": {
      position: "absolute",
      top: "80%",
      left: "75%"
    }
  }
}));

export const Profile = props => {
  const classes = useStyles();
  const [toggle, setToggle] = useState("favs");
  const [editGrocery, setEditGrocery] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!props.user.authenticated) props.history.push("/");
    props.loadFavorites().then(res => setFavorites(res));
    props.loadGroceries().then(res => setGroceries(res));
  }, []);

  const handleChange = (i, e) => {
    groceries[i] = e.target.value;
  };

  const handleDelete = i => {
    const newList = [...groceries];
    newList.splice(i, 1);
    setGroceries(newList);
  };

  const handleAddItems = () => {
    const newList = [...groceries];
    newList.push("");
    setGroceries(newList);
  };

  const handleSubmit = () => {
    props.updateGroceries(groceries);
    setEditGrocery(false);
  };

  const handleNameChange = () => {
    setEditName(false);
    props.updateName(name);
  };

  const handleImageChange = e => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    props.uploadImage(formData);
  };
  const handleEditImage = () => {
    const fileInput = document.querySelector("#imageInput");
    fileInput.click();
  };

  const favUI = () => {
    return (
      <Grid container>
        {favorites.map((r, i) => {
          return (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={i}
              onClick={e => props.selectRecipe(r)}
            >
              <RecipeCard title={r.title} picture_url={r.picture_url} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const groceryUI = () => {
    if (!editGrocery) {
      return (
        <div style={{ paddingLeft: "5%" }}>
          <ul className={classes.groceryList}>
            {groceries.map((g, i) => {
              return <li key={i}>{g}</li>;
            })}
          </ul>
          <Button
            className={classes.editButton}
            size="small"
            variant="contained"
            color="secondary"
            onClick={e => setEditGrocery(true)}
          >
            Edit
          </Button>
        </div>
      );
    } else {
      return (
        <>
          <div className={classes.txtFldAlign}>
            {groceries.map((g, i) => {
              return (
                <div
                  key={`${groceries.length}.${i}`}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <IconButton onClick={e => handleDelete(i)}>
                    <CloseIcon />
                  </IconButton>
                  <TextField
                    key={i}
                    size="small"
                    variant="outlined"
                    defaultValue={g}
                    style={{ width: "250px" }}
                    onChange={e => handleChange(i, e)}
                  />
                </div>
              );
            })}
          </div>
          <div className={classes.addDoneButton}>
            <Button
              className={classes.editButton}
              size="small"
              variant="contained"
              color="secondary"
              onClick={e => handleAddItems()}
              style={{ marginTop: 5, display: "inline" }}
            >
              Add
            </Button>
            <Button
              className={classes.editButton}
              size="small"
              variant="contained"
              color="secondary"
              onClick={e => handleSubmit()}
              style={{ marginTop: 5, marginLeft: "5px" }}
            >
              Done
            </Button>
          </div>
        </>
      );
    }
  };

  const profileSkeleton = () => {
    return (
      <div className={classes.content}>
        <div className={classes.profileContainer}>
          <img
            className={classes.profileImage}
            src="https://firebasestorage.googleapis.com/v0/b/cookwithme-fc78a.appspot.com/o/no-img.png?alt=media"
            alt="profile"
          />
          <div className={classes.userInfo}>
            <Typography className={classes.textStyle} variant="h6">
              user
            </Typography>
            <Typography className={classes.textStyle} variant="body1">
              user@user.com
            </Typography>
            <Button
              className={classes.editButton}
              size="small"
              variant="contained"
              color="secondary"
            >
              Edit
            </Button>
          </div>
        </div>
        <Grid container>
          <Grid item xs={12} md={6} lg={4}>
            <div className={classes.skeletonDivOne}></div>
            <div className={classes.skeletonDivTwo}></div>
            <div className={classes.skeletonDivThree}></div>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <div className={classes.skeletonDivOne}></div>
            <div className={classes.skeletonDivTwo}></div>
            <div className={classes.skeletonDivThree}></div>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <div className={classes.skeletonDivOne}></div>
            <div className={classes.skeletonDivTwo}></div>
            <div className={classes.skeletonDivThree}></div>
          </Grid>
        </Grid>
      </div>
    );
  };

  const profileUI = () => {
    return (
      <div className={classes.content}>
        <div className={classes.profileContainer}>
          <div className={classes.imageWrapper}>
            <img
              className={classes.profileImage}
              src={props.user.details.image}
              alt="profile"
            />
            <input
              type="file"
              id="imageInput"
              hidden="hidden"
              onChange={handleImageChange}
            />
            <Tooltip title="Edit Profile pic">
              <Button onClick={handleEditImage}>
                <EditIcon color="secondary" />
              </Button>
            </Tooltip>
          </div>

          <div className={classes.userInfo}>
            {!editName ? (
              <Typography className={classes.textStyle} variant="h6">
                {props.user.details.name}
              </Typography>
            ) : (
              <TextField
                size="small"
                variant="outlined"
                defaultValue={props.user.details.name}
                onChange={e => setName(e.target.value)}
              ></TextField>
            )}

            <Typography className={classes.textStyle} variant="body1">
              {props.user.details.id}
            </Typography>
            {!editName ? (
              <Button
                className={classes.editButton}
                size="small"
                variant="contained"
                color="secondary"
                onClick={e => setEditName(true)}
              >
                Edit
              </Button>
            ) : (
              <Button
                className={classes.editButton}
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleNameChange}
              >
                Done
              </Button>
            )}
          </div>
          <div>
            <IconButton onClick={e => setToggle("favs")}>
              <BookmarkIcon color="primary" />
            </IconButton>
            <IconButton onClick={e => setToggle("groceries")}>
              <ShoppingCartIcon color="primary" />
            </IconButton>
            <Tooltip title="Create Recipe">
              <IconButton onClick={e => props.history.push("/addrecipe")}>
                <AddBoxIcon color="primary" />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {toggle === "favs" ? favUI() : groceryUI()}
      </div>
    );
  };

  return (
    <>
      <Navbar />

      {props.user.details.name ? profileUI() : profileSkeleton()}
    </>
  );
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  loadFavorites,
  loadGroceries,
  selectRecipe,
  updateGroceries,
  uploadImage,
  updateName
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
