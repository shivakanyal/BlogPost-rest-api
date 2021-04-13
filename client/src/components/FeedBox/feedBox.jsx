import { Container, Grid } from "@material-ui/core";
import React, { Component } from "react";
import Feed from "../Feed/feed";
import "./feedBox.css";
class FeedBox extends Component {
  render() {
    return (
      <Container>
        <Grid container justify="center" alignItems="center">
          {this.props.feeds.map(
            ({
              _id,
              title,
              content,
              imageUrl,
              date,
              creatorName,
              creatorId,
            }) => (
              <Grid
                key={_id + "hulle"}
                item
                container
                spacing={3}
                md={4}
                sm={6}
                xs={12}
              >
                <Feed
                  user={this.props.user}
                  key={_id}
                  _id={_id}
                  title={title}
                  content={content}
                  imageUrl={imageUrl}
                  date={date}
                  creatorName={creatorName}
                  creatorId={creatorId}
                  handleDelete={() => this.props.handleDelete(_id)}
                />
              </Grid>
            )
          )}
        </Grid>
      </Container>
    );
  }
}
export default FeedBox;
