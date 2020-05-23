import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: "0px",
    height: "40vh",
    position: "relative",
    "&:hover": {
      "& p": {
        opacity: "1"
      },
      "& img": {
        opacity: "0.6"
      },
      backgroundColor: "grey"
    }
  },
  tooltiptext: {
    position: "absolute",
    top: "90%",
    left: "5%",
    color: "white",
    margin: "0",
    opacity: "0"
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
}));

function RecipeCard(props) {
  const classes = useStyles();
  const shortenTitle = title => {
    if (title.length >= 46) return title.slice(0, 46) + "...";
    else return title;
  };
  return (
    <>
      <div
        className={classes.root}
        onClick={e =>
          props.history.push(`/recipe/${props.title.split(" ").join("-")}`)
        }
      >
        <img
          className={classes.image}
          alt="recipe img"
          src={props.picture_url}
        />
        <p className={classes.tooltiptext}>{shortenTitle(props.title)}</p>
      </div>
    </>
  );
}

export default withRouter(RecipeCard);
