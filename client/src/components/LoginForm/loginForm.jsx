import React from "react";
import "./loginForm.css";
import { Link } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  Button,
  // TextField,
  Grid,
  Paper,
  // AppBar,
  Typography,
  // Toolbar,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

// import { BRAND_NAME } from "../constants";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", isAuthenticate: false };
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    loader: false,
  };
  handleChange(event) {
    this.setState({
      email: event.state.email,
      password: event.state.password,
    });
  }
  render() {
    let { loader } = this.state;
    return (
      <div>
        {loader && <CircularProgress className="circular-progress" />}
        {!loader && (
          <div>
            {" "}
            <Typography component="h1" variant="h5" className="mg-t">
              Not Registered? <Link to="/signup"> Signup</Link>
            </Typography>
            <Grid
              container
              spacing={0}
              justify="center"
              direction="row"
              className="normalize"
              align="center"
            >
              <Grid item>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  spacing={2}
                  className="login-form"
                >
                  <Paper
                    variant="elevation"
                    elevation={2}
                    className="login-background"
                  >
                    <Grid item>
                      <Typography component="h1" variant="h5">
                        Login
                      </Typography>
                    </Grid>
                    <Grid item>
                      <ValidatorForm
                        onSubmit={(e) =>
                          this.props.handleSubmit(
                            e,
                            this.state.email,
                            this.state.password,
                            this.setState({ loader: true })
                          )
                        }
                      >
                        <Grid container direction="column" spacing={2}>
                          <Grid item>
                            <TextValidator
                              className="input-width"
                              type="email"
                              placeholder="Email"
                              fullWidth
                              name="email"
                              variant="outlined"
                              value={this.state.email}
                              validators={["required", "isEmail"]}
                              errorMessages={["required", "email is not valid"]}
                              onChange={(event) =>
                                this.setState({
                                  [event.target.name]: event.target.value,
                                })
                              }
                              autoFocus
                            />
                          </Grid>
                          <Grid item>
                            <TextValidator
                              className="input-width"
                              type="password"
                              placeholder="Password"
                              fullWidth
                              name="password"
                              variant="outlined"
                              value={this.state.password}
                              validators={["required"]}
                              errorMessages={["required"]}
                              onChange={(event) =>
                                this.setState({
                                  [event.target.name]: event.target.value,
                                })
                              }
                              // required
                            />
                          </Grid>
                          <Grid item>
                            <Button
                              variant="outlined"
                              color="primary"
                              type="submit"
                              className="button-block"
                            >
                              Submit
                            </Button>
                          </Grid>
                        </Grid>
                      </ValidatorForm>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        Forgot Password?
                      </Link>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}
export default Login;
