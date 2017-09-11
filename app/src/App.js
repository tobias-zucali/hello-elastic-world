import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'LOADING…',
      newUserName: ''
    };

    this.loadUsers = this.loadUsers.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    this.resetUsers = this.resetUsers.bind(this);
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers() {
    api('/api/users').then((allUsers) => {
      console.log('Users', allUsers);
      if (allUsers.length > 0) {
        this.setState({
          name: allUsers[allUsers.length - 1].name
        });
      } else {
        this.setState({
          name: 'NO ENTRIES IN DB'
        });
      }
    });
  }

  createNewUser(event) {
    event.preventDefault();
    const newUserName = this.state.newUserName;
    if (newUserName) {
      api(`/api/users/add/${ newUserName }`).then((res) => {
        this.loadUsers();
      });
      this.setState({newUserName: ''})
    }
  }

  resetUsers() {
    api('/api/users/drop').then(
      (res) => api('/api/users/create')
    ).then(
      this.loadUsers
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome { this.state.name }</h2>
        </div>
        <form
          className="App-intro"
          onSubmit={ this.createNewUser }
        >
          <label>
            New user
            <input
              value={ this.state.newUserName }
              onChange={ (event) => this.setState({newUserName: event.target.value}) }
              placeholder="name"
            />
            <button type="submit">Create new user</button>
          </label>
        </form>
        <button onClick={ this.resetUsers }>Reset users</button>
      </div>
    );
  }
}

export default App;

function api(url)
{
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }).then((result) => {
    if (result.success) {
      return result.data;
    } else {
      return Promise.reject(result);
    }
  });
}