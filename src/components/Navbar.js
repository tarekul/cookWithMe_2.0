import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
//MUI stuff
import {
  AppBar,
  Toolbar,
  InputBase,
  Button,
  Typography
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
//icons
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";
import cookImg from "../dining-room.png";

import { connect } from "react-redux";
import { openDialog, logoutUser } from "../redux/actions/userActions";
import { setSearch } from "../redux/actions/recipeActions";

const useStyles = makeStyles(theme => ({
  toolbar: {
    height: "95px",
    display: "flex",
    justifyContent: "space-between"
  },
  title: {
    display: "none",
    cursor: "pointer",
    [theme.breakpoints.up("sm")]: {
      //fontSize: "2rem",
      display: "inline",
      padding: theme.spacing(1, 1),
      fontFamily: "Bad Script,cursive"
    }
  },
  logo: {
    width: "45px",
    height: "45px",
    verticalAlign: "sub"
  },
  search: {
    position: "relative",
    backgroundColor: theme.palette.common.white,
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    borderRadius: theme.shape.borderRadius,
    marginLeft: "10px",
    width: "270px",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
      marginRight: theme.spacing(2)
    }
  },
  searchIcon: {
    padding: "8px",
    position: "absolute",
    color: "silver"
  },
  inputInput: {
    padding: theme.spacing(0.5, 0.5, 0.5, 0),
    paddingLeft: theme.spacing(5)
  },
  button: {
    color: theme.typography.button.color,
    fontWeight: "bold",
    padding: "0",
    paddingLeft: "10px",
    minWidth: "0",
    cursor: "pointer"
  },
  buttonGroup: {
    float: "right"
  }
}));

function Navbar(props) {
  const classes = useStyles();

  const [search, setsearch] = useState("");

  useEffect(() => {
    if (props.recipe.search) setsearch(props.recipe.search);
  }, []);

  const handleChange = e => {
    setsearch(e.target.value);
    if (e.target.value === "") props.setSearch("");
  };

  const handleSearch = e => {
    if (e.keyCode === 13) {
      props.setSearch(search);
      props.history.push("/");
    }
  };

  const handleLogout = () => {
    props.logoutUser();
    props.history.push("/");
  };

  const handleClick = e => {
    props.openDialog(e.currentTarget.id);
  };

  const buttonLayout = () => {
    return props.user.authenticated ? (
      <>
        <Button
          id="profile"
          className={classes.button}
          onClick={e => props.history.push("/profile")}
        >
          <AccountCircleIcon />
        </Button>
        <Button id="logout" className={classes.button} onClick={handleLogout}>
          LOGOUT
        </Button>
      </>
    ) : (
      <>
        <Button id="login" className={classes.button} onClick={handleClick}>
          LOGIN
        </Button>
        <Button id="signup" className={classes.button} onClick={handleClick}>
          SIGNUP
        </Button>
      </>
    );
  };

  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        <div>
          <img
            className={classes.logo}
            alt="logo"
            src={cookImg}
            onClick={e => props.history.push("/")}
          />
          <Typography
            variant="h4"
            className={classes.title}
            onClick={e => props.history.push("/")}
          >
            CookWme
          </Typography>
        </div>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search..."
            className={classes.inputInput}
            onChange={e => handleChange(e)}
            onKeyDown={e => handleSearch(e)}
            value={search}
          />
        </div>
        <div className={classes.buttonGroup}>{buttonLayout()}</div>
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = state => ({
  user: state.user,
  recipe: state.recipe
});
export default connect(mapStateToProps, { openDialog, logoutUser, setSearch })(
  withRouter(Navbar)
);
