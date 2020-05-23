import React, { useState, useEffect } from "react";
import carrot from "../carrots-food.jpg";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
//components
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
//util
import { recipeLinks } from "../utils/recipeLinks";

//redux
import { connect } from "react-redux";
import { selectRecipe } from "../redux/actions/recipeActions";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  content: {
    marginTop: "95px"
  }
}));

function Home(props) {
  const classes = useStyles();
  const [recipes, setRecipes] = useState([]);
  const [searchResults, setsearchResults] = useState([]);

  useEffect(() => {
    if (recipes.length === 0 && !props.recipe.search) getRecipesFromServer();
    if (props.recipe.search && recipes.length > 0) {
      let search = props.recipe.search.toLowerCase();
      findMatch(search, recipes);
    } else if (props.recipe.search && recipes.length === 0) {
      getRecipesFromServer().then(temp => {
        let search = props.recipe.search.toLowerCase();
        findMatch(search, temp);
      });
    } else setsearchResults([]);
  }, [props.recipe.search]);

  const getRecipesFromServer = () => {
    return axios
      .get("/recipes")
      .then(res => {
        const temp = [...res.data];
        const recipeTitles = temp.map(r => r.title);
        recipeLinks.forEach(r => {
          if (recipeTitles.indexOf(r.title) === -1) temp.push(r);
        });
        setRecipes(temp);

        return temp;
      })
      .catch(err => {
        console.log(err);
        setTimeout(() => {
          window.location.reload(false);
        }, 3000);
      });
  };

  const findMatch = (search, recipes) => {
    const results = recipes.filter(r => {
      if (r.title.toLowerCase().includes(search)) return r;
      else if (r.ingredients) {
        for (let i = 0; i < r.ingredients.length; i++) {
          const ing = r.ingredients[i];
          if (ing.includes(search)) return r;
        }
      }
    });

    if (results.length > 0) setsearchResults(results);
  };

  const createGrid = selectRecipe => {
    const items = searchResults.length > 0 ? searchResults : recipes;
    return items.map((recipe, i) => (
      <Grid
        item
        xs={12}
        md={6}
        lg={4}
        key={recipe.title}
        onClick={e => selectRecipe(recipe)}
      >
        <RecipeCard picture_url={recipe.picture_url} title={recipe.title} />
      </Grid>
    ));
  };
  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "aliceblue" }}>
        <Grid container direction="row" className={classes.content}>
          {createGrid(props.selectRecipe)}
        </Grid>
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  recipe: state.recipe
});
export default connect(mapStateToProps, { selectRecipe })(Home);
