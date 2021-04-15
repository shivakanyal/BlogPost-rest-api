import "./App.css";
import Header from "./components/Header/header";
import AppContainer from "./components/AppContainer/appContainer";
import jwtDecode from "jwt-decode";
import React from "react";
class App extends React.Component {
  state = { feeds: [], filteredFeeds: [] };

  handleLoginFormSubmit = (e, email, password) => {
    e.preventDefault();
    fetch(process.env.REACT_APP_API_URL + "/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then(({ token }) => {
        localStorage.setItem("token", token);
        if (!token) {
          alert("Email or password is incorrect.");
        } else if (token) {
          this.setState({ isAuthenticate: true });
          window.location = "/articles";
        }
      })
      .catch((err) => {
        console.log(err);
        alert("some error occur");
      });
  };

  handleSubmit = (e, { id, title, content, category, image, setLoader }) => {
    e.preventDefault();
    setLoader(true);
    const feed = {
      title: title,
      content: content,
      category: category,
      image: image,
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("image", image);
    const tokenn = localStorage.getItem("token");
    fetch(process.env.REACT_APP_API_URL + "/feed/post", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + tokenn,
      },
      body: formData,
      // There will not be any header for FormData
      // Header for form-data will automatically get appended.
    })
      .then((res) => res.json())
      .then((data) => {
        const Newfeeds = [feed, ...this.state.feeds];
        this.setState({ feeds: Newfeeds });
        window.location = "/articles";
      })
      .catch((err) => {
        console.log("error:", err);
        alert("title and content should be 5 charecter long");
      });

    // Updating The UI
  };
  handleDelete = (id) => {
    const prevFeeds = this.state.feeds;
    const newFeeds = this.state.feeds.filter((feed) => feed._id !== id);
    this.setState({ feeds: newFeeds, filteredFeeds: newFeeds });

    const tokenn = localStorage.getItem("token");
    fetch(process.env.REACT_APP_API_URL + "/feed/post/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + tokenn,
      },
    })
      .then((res) => {
        if (res.status === 500) {
          this.setState({ feeds: prevFeeds, filteredFeeds: prevFeeds });
          throw new Error("some error occur please login again.");
        }
        return res.json();
      })
      .then((result) => console.log("post is deleted successfully!"))
      .catch((err) => {
        alert("some error occur please login again.");
        this.setState({ feeds: prevFeeds, filteredFeeds: prevFeeds });
        console.log("inside error", err);
      });
  };
  handleEdit = (e, { id, title, content, category, image }) => {
    e.preventDefault();
    const feeds = [...this.state.feeds];
    const index = this.state.feeds.findIndex(
      (feed) => feed._id.toString() === id.toString()
    );

    feeds[index] = { _id: id, title, content, category };
    this.setState({ feeds: feeds });
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("image", image);
    const tokenn = localStorage.getItem("token");
    fetch(process.env.REACT_APP_API_URL + "/feed/post/" + id, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: "Bearer " + tokenn,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        window.location = "/articles";
      });
  };
  componentDidMount() {
    fetch(process.env.REACT_APP_API_URL + "/feed/posts", {
      method: "GET",
    })
      .then((posts) => {
        return posts.json();
      })
      .then(({ posts }) => {
        this.setState({ feeds: posts, filteredFeeds: posts });
      })
      .catch((err) => {
        console.log(err);
      });

    try {
      const token = localStorage.getItem("token");
      const user = jwtDecode(token);
      this.setState({ user, isAuthenticate: true });
    } catch (err) {
      // console.log(err);
    }
  }

  handleSearch = (filteredFeeds) => {
    this.setState({ filteredFeeds: filteredFeeds });
  };

  render() {
    return (
      <div className="App">
        <Header
          user={this.state.user}
          isAuthenticate
          handleSearch={this.handleSearch}
          feeds={this.state.feeds}
        />
        <AppContainer
          user={this.state.user}
          feeds={this.state.filteredFeeds}
          isAuthenticate
          handleDelete={this.handleDelete}
          handleEdit={this.handleEdit}
          handleSubmit={this.handleSubmit}
          handleLoginFormSubmit={this.handleLoginFormSubmit}
        />
      </div>
    );
  }
}

export default App;
