import React, { Component } from 'react'
import './App.css'
import MainDisplay from "./components/mainDisplay/index"
import { Provider } from 'react-redux'
import { store } from './store/configureStore'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <MainDisplay />
        </Provider>
      </div>
    )
  }
}

export default App