import React from "react";
import "./signupForm.css";
import { Link } from "react-router-dom";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import CircularProgress from "@material-ui/core/CircularProgress";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      isAuthenticate: false,
      loader: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loader: true });
    fetch(process.env.REACT_APP_API_URL + "/auth/signup", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.username,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.statusCode >= 400 && response.statusCode <= 500) {
          console.log(response);
          alert("some internal error occur.");
          // this.setState({ username: "", password: "", email: "" });
        } else this.props.history.push("/login");
      })
      .catch((err) => {
        console.log(err);
        alert("some error occur");
      });
  };
  render() {
    let { loader } = this.state;
    return (
      <div>
        {loader && <CircularProgress className="circular-progress" />}
        {!loader && (
          <Grid container spacing={0} justify="center" direction="row">
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
                      SignUp
                    </Typography>
                  </Grid>
                  <Grid item>
                    <ValidatorForm onSubmit={this.handleSubmit}>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <TextValidator
                            className="input-width"
                            type="text"
                            placeholder="UserName"
                            fullWidth
                            name="username"
                            variant="outlined"
                            value={this.state.username}
                            validators={["required", "minStringLength:5"]}
                            errorMessages={[
                              "required",
                              "Username should be atleast 5 charecter long.",
                            ]}
                            onChange={(event) =>
                              this.setState({
                                username: event.target.value,
                              })
                            }
                            autoFocus
                          />
                        </Grid>
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
                            validators={["required", "minStringLength:5"]}
                            errorMessages={[
                              "required",
                              "Password should be atleast 5 charecter long.",
                            ]}
                            onChange={(event) =>
                              this.setState({
                                [event.target.name]: event.target.value,
                              })
                            }
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
                  <Grid item className="mrt">
                    Already Registereded? <Link to="/login">Login</Link>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}
export default SignUp;
