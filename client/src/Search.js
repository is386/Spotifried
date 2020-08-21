import React from "react";
import SongTable from "./components/SongTable";
import "./App.css";
import auth from "./components/Auth";
import NavBar from "./components/NavBar";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = { search: "", error: "", songs: [] };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // This checks if the login token exists. This is so the navbar gets updated.
  async componentDidMount() {
    await auth.authenticate(localStorage.getItem("token"));
    this.setState({ loggedIn: auth.authenticated });
    if (!this.state.loggedIn) {
      this.props.history.push("/search");
    }
  }

  handleInputChange(event) {
    //const target = event.target;
    this.setState({ search: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let data = this.state.search;

    fetch(`/search?username=${data}`)
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            console.log(data.songs);
            this.setState({ songs: data.songs });
            this.setState({ error: "" });
          });
        } else if (response.status === 401) {
          this.setState({ error: "Username Not Found." });
          this.setState({ songs: [] });
        } else {
          this.setState({ error: "Something Went Wrong :(" });
          this.setState({ songs: [] });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <NavBar loggedIn={auth.authenticated} />
        <h1>Search</h1>
        <p>Type in a username to see their top ten songs.</p>
        <form onSubmit={this.handleSubmit}>
          <input
            name="search"
            type="text"
            placeholder="Search.."
            value={this.state.search}
            onChange={this.handleInputChange}
          ></input>

          <input type="submit" value="Submit"></input>
        </form>
        <div>
          <p>{this.state.error}</p>
        </div>

        <SongTable songs={this.state.songs}></SongTable>
      </div>
    );
  }
}

export default Search;
