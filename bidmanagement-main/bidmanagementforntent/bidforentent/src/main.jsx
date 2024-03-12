import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from "./routes/routes"
import { Provider } from 'react-redux'
import store from './app/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router />
  </Provider>,
)
