import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'LOADING…',
    };

    this.loadUsers = this.loadUsers.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logIn = this.logIn.bind(this);
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
          name: allUsers[allUsers.length - 1].username
        });
      } else {
        this.setState({
          name: 'NO ENTRIES IN DB'
        });
      }
    });
    // api('/api/checkAuth').then((res) => {
    //   console.log('/api/checkAuth', res);
    // }).catch((err) => {
    //   console.error('/api/checkAuth', err);
    // });
  }

  signUp(event) {
    event.preventDefault();

    api('/api/signup', {
      body: new FormData(event.target),
      method: 'POST',
    }).then((res) => {
      this.loadUsers();
    });
  }

  logIn(event) {
    event.preventDefault();

    api('/api/login', {
      body: new FormData(event.target),
      method: 'POST',
    }).then((res) => {
      this.loadUsers();
    });
  }

  resetUsers() {
    // api('/api/checkAuth').then((res) => {
    //   api('/api/users/create');
    // }).then(
    //   this.loadUsers
    // );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome { this.state.name }</h2>
        </div>
        <form onSubmit={ this.signUp }>
          <input type="text" name="username" placeholder="Username" />
          <input type="password" name="password" placeholder="password" />
          <button type="submit">Sign up</button>
        </form>
        <form onSubmit={ this.logIn }>
          <input type="text" name="username" placeholder="Username" />
          <input type="password" name="password" placeholder="password" />
          <button type="submit">Log in</button>
        </form>
        <button onClick={ this.resetUsers }>Reset users</button>
      </div>
    );
  }
}

export default App;


const defaultOptions = {
  method: 'GET',
  credentials: 'same-origin',
  headers: new Headers({
    'Accept': 'application/json'
  })
}

function api(url, options) {
  return fetch(url, {
    defaultOptions,
    ...options
  }).then((response) => {
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
