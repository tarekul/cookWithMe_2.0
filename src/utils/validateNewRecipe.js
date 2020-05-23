const isEmpty = field => {
  if (field.trim() === "") return true;
  else return false;
};

export const validateRecipe = (title, image, ingred, direct) => {
  const errors = {};
  if (isEmpty(title)) errors.title = "Title cannot be empty";
  if (typeof image !== "object") errors.image = "image is not correct format";
  if (ingred.length === 0) errors.ingred = "Must have atleast one ingredient";
  if (direct.length === 0) errors.direct = "Must have atleast one direction";

  return {
    valid: Object.keys(errors).length === 0 ? true : false,
    ...errors
  };
};
