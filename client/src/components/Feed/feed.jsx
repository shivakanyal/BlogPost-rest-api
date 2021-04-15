import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red, grey } from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FullscreenIcon from "@material-ui/icons/Fullscreen";

import { Link } from "react-router-dom";
const useStyles = makeStyles(() => ({
  root: {
    margin: 25,
    // minWidth: 340,
    // maxwidth: 500,
    backgroundColor: grey[200],
    width: 340,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const Feed = ({
  user,
  _id,
  title,
  content,
  imageUrl,
  creatorId,
  handleDelete,
  date,
  creatorName,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {creatorName[0].toUpperCase()}
          </Avatar>
        }
        action={
          <Link to={`/articles/${_id}`}>
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          </Link>
        }
        title={creatorName}
        subheader={date}
      />
      <CardMedia
        className={classes.media}
        image={imageUrl}
        title="Paella dish"
      />
      <CardContent>
        <Typography
          variant="body1"
          fontWeight="fontWeightBold"
          component="p"
          noWrap
        >
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" noWrap>
          {content}
        </Typography>
      </CardContent>
      {user && user.userId === creatorId && (
        <CardActions disableSpacing>
          <Link to={`/articles/${_id}`}>
            <IconButton aria-label="add to favorites">
              <FullscreenIcon />
            </IconButton>
          </Link>
          <Link to={`/articles/register/${_id}`}>
            <IconButton aria-label="share">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDelete(_id)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};

export default Feed;
