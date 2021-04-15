import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red, grey } from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Redirect } from "react-router";
const useStyles = makeStyles(() => ({
  root: {
    margin: 25,
    Minwidth: 360,
    backgroundColor: grey[200],
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const FeedView = (props) => {
  const classes = useStyles();

  const id = props.match.params.id;
  const feed = props.feeds.find(
    (prop) => prop._id.toString() === id.toString()
  );
  if (!feed) {
    <Redirect to="/not-found" />;
    return null;
  }
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {feed.creatorName[0].toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={feed.creatorName}
        subheader={feed.date}
      />
      <CardMedia
        className={classes.media}
        image={feed.imageUrl}
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body1" fontWeight="fontWeightBold" component="p">
          {feed.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {feed.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeedView;
