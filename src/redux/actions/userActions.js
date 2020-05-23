import {
  SET_USER,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  LOAD_FAVORITES,
  SET_AUTHENTICATED,
  SET_ERRORS,
  REMOVE_ERRORS,
  LOGOUT_USER,
  LOAD_GROCERIES
} from "../types";

import axios from "axios";

export const openDialog = option => dispatch => {
  dispatch({ type: OPEN_DIALOG, payload: option });
};

export const closeDialog = () => dispatch => {
  dispatch({ type: CLOSE_DIALOG });
};

export const signupUser = userData => dispatch => {
  return axios
    .post("/users/signup", userData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch({ type: SET_AUTHENTICATED });
      dispatch({ type: REMOVE_ERRORS });

      return "close dialog";
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const loginUser = userData => dispatch => {
  return axios
    .post("/users/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch({ type: SET_AUTHENTICATED });
      dispatch({ type: REMOVE_ERRORS });
      return "close dialog";
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const uploadImage = formData => dispatch => {
  return axios
    .post("/users/image", formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => console.log(err));
};

export const updateName = name => dispatch => {
  if (name.trim() !== "") {
    return axios
      .post("/users/name", { name })
      .then(() => {
        dispatch(getUserData());
      })
      .catch(err => console.log(err));
  }
};

const getUserData = () => dispatch => {
  axios.get("/users/cred").then(res => {
    dispatch({ type: SET_USER, payload: res.data });
  });
};
export const loadFavorites = () => dispatch => {
  return axios
    .get(`/favorites`)
    .then(res => {
      dispatch({ type: LOAD_FAVORITES, payload: res.data });
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
};

export const logoutUser = () => dispatch => {
  axios.get("users/logout");
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: LOGOUT_USER });
};
const setAuthorizationHeader = token => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", `Bearer ${token}`);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

export const favoriteRecipe = (title, web_url, picture_url) => dispatch => {
  return axios
    .get("/favorites")
    .then(res => {
      const ifRecipeExists = res.data.filter(recipe => {
        return recipe.title === title;
      });
      if (ifRecipeExists.length === 0) {
        return axios.post(`/favorites`, {
          title,
          web_url,
          picture_url
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const unFavoriteRecipe = title => dispatch => {
  axios.delete(`/favorites/${title}`).catch(err => {
    console.log(err);
  });
};

export const addGrocery = grocery => dispatch => {
  axios.post("/grocery", { grocery }).catch(err => {
    console.log(err);
  });
};

export const updateGroceries = groceries => dispatch => {
  axios.put("/grocery", { groceries }).catch(err => {
    console.log(err);
  });
};

export const loadGroceries = () => dispatch => {
  return axios
    .get("/grocery")
    .then(res => {
      dispatch({ type: LOAD_GROCERIES, payload: res.data });
      dispatch(getUserData());
      return res.data;
    })
    .catch(err => {
      console.log(err);
    });
};
