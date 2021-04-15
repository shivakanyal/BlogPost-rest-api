import {
  Button,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import React, { useState } from "react";
import "./feedRegistration.css";
import { useParams } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  const [loader, setLoader] = useState(false);
  return (
    <div>
      {loader && <CircularProgress className="circular-progress" />}
      {!loader && (
        <Container justify="center">
          <Typography
            varient="h1"
            component="h2"
            gutterBottom
            className="form-heading"
          >
            Create a New Article
          </Typography>
          <ValidatorForm
            onSubmit={(e) =>
              props.handleSubmit(e, {
                id,
                title,
                content,
                category,
                image,
                ...props,
                setLoader,
              })
            }
          >
            <TextValidator
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              label="Title"
              variant="outlined"
              fullWidth
              color="primary"
              value={title}
              validators={["required", "minStringLength:5"]}
              errorMessages={[
                "required",
                "Title should be atleast 5 charecter long.",
              ]}
            />
            <TextValidator
              onChange={(e) => setContent(e.target.value)}
              className="form-input"
              label="Content"
              variant="outlined"
              color="primary"
              multiline
              rows={4}
              value={content}
              fullWidth
              validators={["required", "minStringLength:5"]}
              errorMessages={[
                "required",
                "Content should be atleast 5 charecter long.",
              ]}
            />
            <Button variant="contained" component="label">
              <input
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                required={id === undefined}
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
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              endIcon={<KeyboardArrowRight />}
              // onClick={() => setLoader(true)}
            >
              Submit
            </Button>
          </ValidatorForm>
        </Container>
      )}
    </div>
  );
};
export default FeedRegistrationForm;
