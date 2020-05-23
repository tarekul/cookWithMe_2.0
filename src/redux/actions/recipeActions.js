import {
  SELECT_RECIPE,
  LOADING_RECIPE,
  STOP_LOADING_RECIPE,
  ADD_INGREDIENTS_STEPS,
  FROM_LOCAL_UPDATE_STATE,
  SET_SEARCH_RESULTS
} from "../types";
import axios from "axios";

export const selectRecipe = obj => dispatch => {
  dispatch({ type: SELECT_RECIPE, payload: obj });
};

// const uploadRecipeImage = imageForm => {
//   axios.post('/recipes/imageupload',imageForm)
//   .then(()=>{})
// }
export const addNewRecipe = (
  title,
  imageForm,
  ingredients,
  steps
) => dispatch => {
  return axios.post("/recipes/uploadimage", imageForm).then(res => {
    const { picture_url } = res.data;
    return axios
      .post("/recipes/usercreated", {
        title,
        picture_url,
        ingredients,
        steps
      })
      .then(res => {
        console.log(res.data);
      });
  });
};

export const loadIngredAndStepsToState = (
  title,
  web_url,
  picture_url
) => dispatch => {
  dispatch({ type: LOADING_RECIPE });
  return axios
    .get(`/recipes/${title}`)
    .then(res => {
      dispatch({ type: STOP_LOADING_RECIPE });
      dispatch({ type: ADD_INGREDIENTS_STEPS, payload: res.data });
      return res.data;
    })
    .catch(err => {
      if (
        err.response &&
        err.response.data.message === "recipe does not exist"
      ) {
        return axios
          .post("/recipes", {
            title,
            web_url,
            picture_url
          })
          .then(res => {
            const { ingredients, steps } = res.data;
            return axios.post("/recipes", {
              title,
              picture_url,
              web_url,
              userId: "",
              ingredients,
              steps
            });
          })
          .then(res => {
            dispatch({ type: STOP_LOADING_RECIPE });
            dispatch({ type: ADD_INGREDIENTS_STEPS, payload: res.data });
            return res.data;
          });
      } else return err;
    });
};

export const fromLocalUpdateState = (
  title,
  web_url,
  picture_url,
  steps,
  ingredients
) => dispatch => {
  dispatch({
    type: FROM_LOCAL_UPDATE_STATE,
    payload: {
      title,
      web_url,
      picture_url,
      steps,
      ingredients
    }
  });
};

export const setSearch = search => dispatch => {
  dispatch({ type: SET_SEARCH_RESULTS, payload: search });
};
