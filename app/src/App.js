import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'NOT AUTHENTICATED',
      users: []
    };

    this.loadUsers = this.loadUsers.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logIn = this.logIn.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers() {
    api('/api/users').then((users) => {
      console.log('/api/users', users);
      this.setState({
        users
      });
      this.checkAuthentication();
    });
  }

  signUp(event) {
    event.preventDefault();

    api('/api/signup', {
      body: new FormData(event.target),
      method: 'POST',
    }).then((res) => {
      console.log('/api/signup', res);
      this.checkAuthentication();
    });
  }

  logIn(event) {
    event.preventDefault();

    api('/api/login', {
      body: new FormData(event.target),
      method: 'POST',
    }).then((res) => {
      console.log('/api/login', res);
      this.checkAuthentication();
    });
  }

  checkAuthentication() {
    api('/api/checkAuth').then((res) => {
      console.log('/api/checkAuth', res);
      if (res.isAuthenticated) {
        this.setState({
          name: res.user.username
        });
      }
    }).catch((err) => {
      console.error('/api/checkAuth', err);
    });
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
        <button onClick={ this.checkAuthentication }>Check authentication</button>
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
    ...defaultOptions,
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
