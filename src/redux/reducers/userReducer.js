import {
  SET_USER,
  SET_AUTHENTICATED,
  LOGOUT_USER,
  SET_ERRORS,
  REMOVE_ERRORS,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  LOAD_FAVORITES,
  UPDATE_FAVORITES,
  REMOVE_FAVORITE,
  LOAD_GROCERIES,
  UPDATE_GROCERY,
  ADD_GROCERY
} from "../types";

const initialState = {
  open: false, //dialog open or close
  option: null, //signup or login
  authenticated: false, //user authenticated,
  details: {},
  errors: {},
  fav: [],
  groceries: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_USER:
      return {
        ...state,
        details: { ...action.payload }
      };
    case LOGOUT_USER:
      return {
        ...state,
        authenticated: false
      };
    case OPEN_DIALOG:
      return {
        ...state,
        open: true,
        option: action.payload
      };
    case CLOSE_DIALOG:
      return {
        ...state,
        open: false,
        option: null
      };
    case SET_ERRORS:
      return {
        ...state,
        errors: action.payload
      };
    case REMOVE_ERRORS:
      return {
        ...state,
        errors: {}
      };
    case LOAD_FAVORITES: {
      return {
        ...state,
        fav: [...action.payload]
      };
    }
    case UPDATE_FAVORITES:
      return {
        ...state,
        fav: [action.payload, ...state.fav]
      };
    case REMOVE_FAVORITE:
      return {
        ...state,
        fav: state.fav.filter(e => e.title !== action.payload)
      };
    case LOAD_GROCERIES:
      return {
        ...state,
        groceries: [...action.payload]
      };
    case UPDATE_GROCERY:
      const { index, change } = action.payload;
      state.groceries[index] = change;
      return {
        ...state
      };
    case ADD_GROCERY:
      return {
        ...state,
        groceries: [action.payload, ...state.groceries]
      };
    default:
      return state;
  }
}
