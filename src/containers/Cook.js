import React from "react";
import WebSpeech from "../utils/webSpeech";
import {
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

//icons
import CloseIcon from "@material-ui/icons/Close";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";

//redux
import { connect } from "react-redux";

const styles = theme => ({
  root: {
    padding: "10px",
    position: "relative"
  },
  leftContainer: {
    padding: "20px",
    "@media screen and (max-width:972px)": {
      height: "30vh",
      overflow: "auto"
    },
    "@media screen and (max-width:501px)": {
      height: "25vh",
      overflow: "auto"
    },
    "@media screen and (max-width:360px)": {
      height: "20vh",
      overflow: "auto"
    },
    "@media screen and (max-width:320px)": {
      height: "18vh",
      overflow: "auto"
    }
  },
  header: {
    fontSize: "40px",
    "@media screen and (max-width:768px)": {
      fontSize: "35px"
    },
    "@media screen and (max-width:380px)": {
      fontSize: "30px"
    },
    "@media screen and (max-width:320px)": {
      fontSize: "25px"
    },
    fontFamily: "Playfair display,sans serif",
    margin: "0",
    paddingLeft: "20px"
  },
  step: {
    fontSize: "40px",
    "@media screen and (max-width:768px)": {
      fontSize: "25px"
    },
    "@media screen and (max-width:501px)": {
      fontSize: "20px"
    },
    "@media screen and (max-width:360px)": {
      fontSize: "18px"
    },
    "@media screen and (max-width:320px)": {
      fontSize: "15px"
    },
    color: "#333",
    fontFamily: "Playfair display,sans serif"
  },
  ingredTitle: {
    fontSize: "25px",
    color: "#5e5e5e",
    padding: "12px",
    fontFamily: "Playfair display,sans serif",
    margin: "30px 0 10px 10px"
  },
  listIngred: {
    color: "grey",
    listStyleType: "square",
    fontSize: "18px",
    marginTop: "0",
    "@media screen and (max-width:768px)": {
      fontSize: "25px",
      height: "30vh",
      overflow: "auto"
    },
    "@media screen and (max-width:501px)": {
      fontSize: "20px",
      height: "25vh",
      overflow: "auto"
    },
    "@media screen and (max-width:360px)": {
      fontSize: "18px",
      height: "15vh",
      overflow: "auto"
    },
    "@media screen and (max-width:320px)": {
      fontSize: "15px",
      height: "13vh",
      overflow: "auto"
    }
  },
  help: {
    color: "rgb(165, 165, 165)",
    fontSize: "45px"
  },
  close: {
    color: theme.palette.primary.main,
    fontSize: "45px"
  },
  topRightButtons: { float: "right" },
  cookIcon: {
    color: "rgb(89, 165, 246)",
    fontSize: "60px"
  },
  leftPlayRight: {
    padding: "20px",
    float: "left"
  }
});

class Cook extends React.Component {
  constructor(props) {
    super(props);

    this.ws = null;
    this.state = {
      current: 0,
      title: "",
      ingredients: [],
      steps: [],
      dialogState: false
    };
  }

  componentDidMount() {
    if (this.props.recipe.steps.length === 0) {
      const localRecipe = JSON.parse(window.localStorage.getItem("recipe"));
      this.setState({ title: localRecipe.title });
      this.setState({ ingredients: localRecipe.ingredients });
      this.setState({ steps: localRecipe.steps }, () => {
        this.ws = new WebSpeech(this.state.steps, this.parentFunc);
        this.ws.loadCommands();
      });
    } else if (this.props.recipe.steps.length > 0) {
      this.setState({ title: this.props.recipe.title });
      this.setState({ ingredients: this.props.recipe.ingredients });
      this.setState({ steps: this.props.recipe.steps }, () => {
        this.ws = new WebSpeech(this.state.steps, this.parentFunc);
        this.ws.loadCommands();
      });
    } else this.props.history.push("/");
  }

  componentWillUnmount() {
    this.ws.stopAssistant();
  }

  parentFunc = (index, cb) => {
    this.setState({ current: index }, cb);
  };

  stepForward() {
    const { current, steps } = this.state;
    if (current + 1 < steps.length) {
      this.setState({ current: current + 1 }, () => {
        this.ws.loadCommands(this.state.current);
      });
    }
  }
  stepBack() {
    const { current } = this.state;
    if (current + 1 > 1) {
      this.setState({ current: current - 1 }, () => {
        this.ws.loadCommands(this.state.current);
      });
    }
  }

  ingredUI() {
    const { ingredients } = this.state;
    return ingredients.map((ing, i) => {
      return <li key={i}>{ing}</li>;
    });
  }

  startAssistant() {
    if (this.ws.isRecognizing()) this.ws.stopAssistant();
    else {
      this.ws.startAssistant();
      this.ws.speak("Hi their lets start cooking");
    }
  }
  render() {
    const { classes } = this.props;
    const { title, current, steps, dialogState } = this.state;
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <h5 className={classes.header}>{`Step ${current + 1} of ${
              steps.length
            }`}</h5>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Button className={classes.topRightButtons}>
              <CloseIcon
                className={classes.close}
                onClick={e =>
                  this.props.history.push(
                    `/recipe/${title.split(" ").join("_")}`
                  )
                }
              />
            </Button>
            <Button className={classes.topRightButtons}>
              <HelpOutlineIcon
                className={classes.help}
                onClick={e => this.setState({ dialogState: true })}
              />
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={9} lg={9}>
            <div className={classes.leftContainer}>
              <div className={classes.step}>{steps[current]}</div>
            </div>
            <div className={classes.leftPlayRight}>
              <IconButton onClick={e => this.stepBack()}>
                <ArrowBackIosIcon className={classes.cookIcon} />
              </IconButton>
              <IconButton
                style={{ paddingLeft: "0" }}
                onClick={e => (this.ws ? this.startAssistant() : "")}
              >
                <PlayCircleOutlineIcon className={classes.cookIcon} />
              </IconButton>
              <IconButton onClick={e => this.stepForward()}>
                <ArrowForwardIosIcon className={classes.cookIcon} />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <h5 className={classes.ingredTitle}>Ingredients</h5>
            <ul className={classes.listIngred}>{this.ingredUI()}</ul>
          </Grid>
        </Grid>

        <Dialog open={dialogState}>
          <DialogTitle>How to Use Cooking Mode</DialogTitle>
          <DialogContent>
            This is your personal cooking assistant. To start assistant click on
            the play button. Use START, PAUSE, RESUME, RESTART, LAST, BACK, NEXT
            commands to guide your assistant. Click on the play button to stop
            the assistant
          </DialogContent>
          <DialogActions>
            <Button
              style={{ color: "rgb(89, 165, 246)" }}
              onClick={e => this.setState({ dialogState: false })}
            >
              Got it
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  recipe: state.recipe
});

export default connect(mapStateToProps, {})(withStyles(styles)(Cook));
