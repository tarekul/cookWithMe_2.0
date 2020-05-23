import React from "react";
import "./App.css";
import { Route, HashRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Home from "./containers/Home";
import Recipe from "./containers/Recipe";
import Register from "./components/Register";
import Cook from "./containers/Cook";
import Profile from "./containers/Profile";

import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser } from "./redux/actions/userActions";
import AddRecipe from "./containers/AddRecipe";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#fa3c3c",
      main: "#db3434",
      dark: "rgba(255,0,0,0.4)",
      contrastText: "#fff"
    },
    secondary: {
      light: "rgb(92, 171, 255)",
      main: "rgb(89, 165, 246)",
      dark: "rgb(49, 133, 222)",
      contrastText: "#fff"
    }
  },
  typography: {
    button: {
      color: "white",
      fontFamily: "Roboto,sans-serif",
      fontSize: "0.9rem"
    }
  }
});

axios.defaults.baseURL =
  "https://us-central1-cookwithme-fc78a.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser);
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
  }
}
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <HashRouter>
            <Route path="/" component={Register} />
            <Route path="/" exact component={Home} />
            <Route exact path="/recipe/:title" component={Recipe} />
            <Route path="/recipe/:id/cook" component={Cook} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/addrecipe" component={AddRecipe} />
          </HashRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
