import {
  SELECT_RECIPE,
  LOADING_RECIPE,
  STOP_LOADING_RECIPE,
  ADD_INGREDIENTS_STEPS,
  FROM_LOCAL_UPDATE_STATE,
  SET_SEARCH_RESULTS
} from "../types";

const initialState = {
  web_url: "",
  picture_url: "",
  title: "",
  loading: false,
  ingredients: [],
  steps: [],
  search: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SELECT_RECIPE:
      return {
        ...state,
        web_url: action.payload.web_url,
        picture_url: action.payload.picture_url,
        title: action.payload.title
      };
    case LOADING_RECIPE:
      return {
        ...state,
        loading: true
      };
    case STOP_LOADING_RECIPE:
      return {
        ...state,
        loading: false
      };
    case ADD_INGREDIENTS_STEPS:
      return {
        ...state,
        ingredients: action.payload.ingredients,
        steps: action.payload.steps
      };
    case FROM_LOCAL_UPDATE_STATE:
      return { ...state, ...action.payload };
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        search: action.payload
      };
    default:
      return state;
  }
}
