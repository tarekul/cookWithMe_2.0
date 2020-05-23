import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { connect } from "react-redux";
import {
  closeDialog,
  loginUser,
  signupUser
} from "../redux/actions/userActions";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      maxWidth: "600px"
    }
  },
  customError: {
    color: theme.palette.primary.main,
    textAlign: "center"
  }
}));

function Register(props) {
  const classes = useStyles();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    if (e.target.name === "email") setemail(e.target.value);
    else if (e.target.name === "name") setname(e.target.value);
    else if (e.target.name === "password") setpassword(e.target.value);
    else if (e.target.name === "confirmPassword")
      setconfirmPassword(e.target.value);
  };

  const handleLogin = () => {
    props.loginUser({ email, password }).then(res => {
      setemail("");
      setpassword("");
      return res === "close dialog" ? props.closeDialog() : null;
    });
  };

  const handleSignup = () => {
    setLoading(true);
    props.signupUser({ email, name, password, confirmPassword }).then(res => {
      setLoading(false);
      setemail("");
      setpassword("");
      setname("");
      setconfirmPassword("");
      return res === "close dialog" ? props.closeDialog() : null;
    });
  };

  const handleClose = () => {
    setemail("");
    setpassword("");
    setname("");
    setconfirmPassword("");
    props.closeDialog();
  };
  const formInput = () => {
    if (props.user.option === "login") {
      return (
        <form className={classes.root} noValidate autoComplete="off">
          <DialogTitle>LOGIN</DialogTitle>
          <DialogContent>
            <TextField
              label="Email Address"
              name="email"
              type="email"
              color="secondary"
              variant="outlined"
              fullWidth
              autoComplete="off"
              value={email}
              onChange={handleChange}
              error={props.user.errors.email ? true : false}
              helperText={props.user.errors.email}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              color="secondary"
              variant="outlined"
              fullWidth
              value={password}
              onChange={handleChange}
              error={props.user.errors.password ? true : false}
              helperText={props.user.errors.password}
            />
            {props.user.errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {props.user.errors.general}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="primary"
              disabled={loading ? true : false}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={handleLogin}
              disabled={loading ? true : false}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      );
    } else if (props.user.option === "signup") {
      return (
        <form className={classes.root} noValidate autoComplete="off">
          <DialogTitle>SIGNUP</DialogTitle>
          <DialogContent>
            <TextField
              type="email"
              label="Email Address"
              name="email"
              color="secondary"
              autoFocus
              variant="outlined"
              fullWidth
              autoComplete="off"
              value={email}
              onChange={handleChange}
              error={props.user.errors.email ? true : false}
              helperText={props.user.errors.email}
            />
            <TextField
              type="text"
              name="name"
              label="Name"
              color="secondary"
              variant="outlined"
              fullWidth
              autoComplete="off"
              value={name}
              onChange={handleChange}
              error={props.user.errors.name ? true : false}
              helperText={props.user.errors.name}
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              fullWidth
              color="secondary"
              variant="outlined"
              value={password}
              onChange={handleChange}
              error={props.user.errors.password ? true : false}
              helperText={props.user.errors.password}
            />
            <TextField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              fullWidth
              color="secondary"
              variant="outlined"
              value={confirmPassword}
              onChange={handleChange}
              error={props.user.errors.confirmPassword ? true : false}
              helperText={props.user.errors.confirmPassword}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleSignup}>
              Submit
            </Button>
          </DialogActions>
        </form>
      );
    }
  };

  return (
    <>
      <Dialog
        open={props.user.open}
        onClose={props.closeDialog}
        disableBackdropClick
      >
        {formInput()}
      </Dialog>
    </>
  );
}

const mapStateToProps = state => ({
  user: state.user
});
export default connect(mapStateToProps, { closeDialog, loginUser, signupUser })(
  Register
);
