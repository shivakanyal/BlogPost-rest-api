import {
  Button,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import React, { useState } from "react";
import "./feedRegistration.css";
// import { useEffect } from "react";
import { useParams } from "react-router-dom";

const FeedRegistrationForm = (props) => {
  const { id } = useParams();
  let Ftitle = "";
  let Fcontent = "";
  let Fcategory = "other";
  let Fimage = null;

  if (id && props.feeds.length >= 1) {
    const feed = props.feeds.find(
      (feed) => feed._id.toString() === id.toString()
    );

    Ftitle = feed.title;
    Fcontent = feed.content;
    Fcategory = feed.category;
    Fimage = feed.imageUrl;
  }

  const [title, setTitle] = useState(Ftitle);
  const [content, setContent] = useState(Fcontent);
  const [category, setCategory] = useState(Fcategory);
  const [image, setImage] = useState(Fimage);
  return (
    <Container justify="center">
      <Typography
        varient="h1"
        component="h2"
        gutterBottom
        className="form-heading"
      >
        Create a New Article
      </Typography>
      <form
        onSubmit={(e) =>
          props.handleSubmit(e, {
            id,
            title,
            content,
            category,
            image,
            ...props,
          })
        }
      >
        <TextField
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          label="Title"
          variant="outlined"
          fullWidth
          required
          color="primary"
          value={title}
        />
        <TextField
          onChange={(e) => setContent(e.target.value)}
          className="form-input"
          label="Content"
          variant="outlined"
          color="primary"
          multiline
          rows={4}
          value={content}
          fullWidth
          required
        />
        <Button variant="contained" component="label">
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </Button>
        <RadioGroup
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <FormControlLabel value="art" control={<Radio />} label="Art" />
          <FormControlLabel
            value="entertainment"
            control={<Radio />}
            label="Entertainment"
          />
          <FormControlLabel
            value="programming"
            control={<Radio />}
            label="Programming"
          />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          endIcon={<KeyboardArrowRight />}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};
export default FeedRegistrationForm;
