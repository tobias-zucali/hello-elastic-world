import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'LOADING…'
    };
  }
  componentDidMount() {
    api('/api/users/all').then((allUsers) => {
      if (allUsers.length > 0) {
        this.setState({
          name: allUsers[0].username
        });
      } else {
        this.setState({
          name: 'NO ENTRIES IN DB'
        });
      }
    });
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome { this.state.name }</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
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