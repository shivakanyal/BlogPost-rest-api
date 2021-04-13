import React, { Component, Fragment } from "react";
import FeedBox from "../FeedBox/feedBox";
import FeedRegistration from "../FeedRegistration/feedRegistration";
import { Redirect, Route, Switch } from "react-router-dom";
import FeedView from "../FeedView/feedView";
import NotFound from "../NotFound/notFound";
import Login from "../LoginForm/loginForm";
import SignUp from "../SignUpForm/signUpForm";
import Logout from "../Logout/logout";
class AppContainer extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route
            exact
            path="/articles/register/:id"
            render={(props) => (
              <FeedRegistration
                feeds={this.props.feeds}
                handleSubmit={(e, { ...prop }) =>
                  this.props.handleEdit(e, { ...prop })
                }
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/articles/register"
            render={(props) => (
              <FeedRegistration
                handleSubmit={(e, { ...prop }) =>
                  this.props.handleSubmit(e, { ...prop })
                }
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/articles/:id"
            render={(props) => (
              <FeedView
                feeds={this.props.feeds}
                user={this.props.user}
                {...props}
              />
            )}
          />
          <Route path="/not-found" component={NotFound} />
          <Route path="/articles" exact>
            <FeedBox
              feeds={this.props.feeds}
              handleDelete={(id) => this.props.handleDelete(id)}
              user={this.props.user}
            />
          </Route>
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login
                handleSubmit={(e, login, password) =>
                  this.props.handleLoginFormSubmit(e, login, password)
                }
                {...props}
              />
            )}
          />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/signup" component={SignUp} />
          <Redirect exact from="/" to="/articles" />
          <Redirect to="/not-found" />
        </Switch>
      </Fragment>
    );
  }
}
export default AppContainer;
