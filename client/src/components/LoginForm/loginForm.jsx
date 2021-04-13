import React from "react";
import "./loginForm.css";
import { Link } from "react-router-dom";
import {
  Button,
  TextField,
  Grid,
  Paper,
  // AppBar,
  Typography,
  // Toolbar,
} from "@material-ui/core";
// import { BRAND_NAME } from "../constants";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", isAuthenticate: false };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      email: event.state.email,
      password: event.state.password,
    });
  }
  render() {
    return (
      <div>
        {/* <AppBar position="static" alignitems="center" color="primary">
          <Toolbar>
            <Grid container justify="center" wrap="wrap">
              <Grid item>
                <Typography variant="h6">BlogPost</Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar> */}
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
                  <form
                    onSubmit={(e) =>
                      this.props.handleSubmit(
                        e,
                        this.state.email,
                        this.state.password
                      )
                    }
                  >
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <TextField
                          type="email"
                          placeholder="Email"
                          fullWidth
                          name="email"
                          variant="outlined"
                          value={this.state.email}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.value,
                            })
                          }
                          required
                          autoFocus
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          type="password"
                          placeholder="Password"
                          fullWidth
                          name="password"
                          variant="outlined"
                          value={this.state.password}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.value,
                            })
                          }
                          required
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
                  </form>
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
    );
  }
}
export default Login;
