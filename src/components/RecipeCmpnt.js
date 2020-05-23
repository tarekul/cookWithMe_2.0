import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

//mui stuff
import { Grid, Button, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
//icons
import PlayCircleIcon from "@material-ui/icons/PlayCircleOutlineOutlined";
import AddIcon from "@material-ui/icons/AddOutlined";
import RemoveIcon from "@material-ui/icons/Remove";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

//redux
import { connect } from "react-redux";
import {
  loadIngredAndStepsToState,
  fromLocalUpdateState
} from "../redux/actions/recipeActions";

import {
  favoriteRecipe,
  unFavoriteRecipe,
  loadFavorites,
  addGrocery
} from "../redux/actions/userActions";

const useStyles = makeStyles(theme => ({
  content: {
    marginTop: "95px"
  },
  recipeImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  recipeName: {
    textDecoration: "none",
    color: "black",
    fontFamily: "Playfair Display,serif",
    fontSize: "50px",
    display: "block",
    "@media screen and (max-width:500px)": {
      fontSize: "30px"
    }
  },
  rightContainer: {
    padding: "25px 25px 0px 25px"
  },
  stepDetails: {
    padding: "0px 25px 0px 25px"
  },
  listHeader: {
    fontFamily: "Playfair Display,serif",
    fontSize: "25px",
    fontWeight: "bold",
    color: "#5e5e5e",
    paddingLeft: "12px",
    margin: "0"
  },
  list: {
    color: "grey",
    fontFamily: "Roboto,sans serif",
    fontSize: "20px"
  },
  icon: {
    fontSize: "45px",
    color: "rgb(89, 165, 246)"
  }
}));

function RecipeCmpnt(props) {
  const classes = useStyles();

  const [favorited, setfavorited] = useState(false);
  const [addGroceries, setAddGroceries] = useState(false);

  useEffect(() => {
    if (props.recipe.title !== "") {
      let { title, web_url, picture_url } = props.recipe;
      props
        .loadIngredAndStepsToState(title, web_url, picture_url)
        .then(res => {
          window.localStorage.setItem("recipe", JSON.stringify(res));
        })
        .catch(err => {
          setTimeout(() => {
            props.history.push("/");
          }, 4000);
        });
      if (props.user.authenticated) {
        props
          .loadFavorites()
          .then(res => {
            const fav = res.filter(e => e.title === title);
            if (fav.length !== 0) setfavorited(true);
          })
          .catch(err => {
            setTimeout(() => {
              this.props.history.push("/");
            }, 3000);
          });
      }
    } else if (props.recipe.title === "") {
      const recipe = JSON.parse(localStorage.getItem("recipe"));
      let { title, web_url, picture_url, steps, ingredients } = recipe;
      props.fromLocalUpdateState(
        title,
        web_url,
        picture_url,
        steps,
        ingredients
      );
      if (props.user.authenticated) {
        props.loadFavorites().then(res => {
          const fav = res.filter(e => e.title === title);
          if (fav.length !== 0) setfavorited(true);
        });
      }
    }
  }, []);

  const ingredUI = () => {
    const { ingredients } = props.recipe;
    if (ingredients.length > 0) {
      return (
        <ul
          className={classes.list}
          style={{ maxHeight: "30vh", overflow: "auto", listStyle: "circle" }}
        >
          {ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      );
    }
  };

  const handleGrocery = ing => {
    props.addGrocery(ing);
  };

  const addToGroceryUI = () => {
    const { ingredients } = props.recipe;
    if (ingredients.length > 0) {
      return (
        <ul
          className={classes.list}
          style={{
            maxHeight: "30vh",
            overflow: "auto",
            listStyle: "none",
            paddingLeft: "20px"
          }}
        >
          {ingredients.map((ing, i) => (
            <li key={i}>
              <Tooltip title="Add grocery" placement="left-start">
                <AddIcon
                  style={{
                    verticalAlign: "top",
                    fontSize: "20px",
                    marginRight: 5,
                    cursor: "pointer",
                    color: "rgb(89, 165, 246)"
                  }}
                  onClick={e => handleGrocery(ing)}
                />
              </Tooltip>
              {ing}
            </li>
          ))}
        </ul>
      );
    }
  };

  const createStepUI = () => {
    const { steps } = props.recipe;
    if (steps.length > 0) {
      return (
        <ol className={classes.list}>
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      );
    }
  };

  const loading_skeleton = () => {
    return (
      <div style={{ width: "100%" }}>
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
      </div>
    );
  };

  const handleFavorite = option => {
    const { title, web_url, picture_url } = props.recipe;
    if (option === "add") {
      props.favoriteRecipe(title, web_url, picture_url);
      setfavorited(true);
    } else if (option === "remove") {
      props.unFavoriteRecipe(title);
      setfavorited(false);
    }
  };
  const { title, picture_url, web_url } = props.recipe;
  return (
    <Grid container direction="row" className={classes.content}>
      <Grid item xs={12} md={6} lg={6}>
        <div style={{ height: "100%" }}>
          <img className={classes.recipeImg} alt="recipe" src={picture_url} />
        </div>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <div className={classes.rightContainer}>
          <a
            className={classes.recipeName}
            href={web_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </a>
          {props.recipe.loading ? (
            ""
          ) : (
            <Tooltip title="Cooking mode">
              <Button
                onClick={e =>
                  props.history.push(`${title.split(" ").join("_")}/cook`)
                }
              >
                <PlayCircleIcon className={classes.icon} />
              </Button>
            </Tooltip>
          )}
          {props.recipe.loading ? (
            ""
          ) : props.user.authenticated ? (
            <>
              <Tooltip
                title={`${!favorited ? "add to" : "remove from"}  favorites`}
              >
                <Button>
                  {favorited ? (
                    <RemoveIcon
                      className={classes.icon}
                      onClick={e => handleFavorite("remove")}
                    />
                  ) : (
                    <AddIcon
                      className={classes.icon}
                      onClick={e => handleFavorite("add")}
                    />
                  )}
                </Button>
              </Tooltip>
              <Tooltip title="Toggle add Groceries">
                <Button>
                  <AddShoppingCartIcon
                    className={classes.icon}
                    onClick={e => setAddGroceries(!addGroceries)}
                  />
                </Button>
              </Tooltip>
            </>
          ) : (
            ""
          )}

          <p className={classes.listHeader}>Ingredients</p>
          {props.recipe.loading === false
            ? !addGroceries
              ? ingredUI()
              : addToGroceryUI()
            : loading_skeleton()}
        </div>
      </Grid>
      <Grid item md={12} lg={12}>
        <div className={classes.stepDetails}>
          <p className={classes.listHeader}>Directions</p>
          {props.recipe.loading === false ? createStepUI() : loading_skeleton()}
        </div>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = state => ({
  recipe: state.recipe,
  user: state.user
});

const mapActionsToProps = {
  loadIngredAndStepsToState,
  fromLocalUpdateState,
  favoriteRecipe,
  unFavoriteRecipe,
  loadFavorites,
  addGrocery
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withRouter(RecipeCmpnt));
