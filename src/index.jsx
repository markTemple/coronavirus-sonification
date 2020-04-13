import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'

import { ErrorBoundary } from './components/error-boundary'
import { StoreProvider } from './state/store.js'
import { Home } from './pages/home'

/*
  Create a div element in the DOM with the ID: "application". This element will
  be the root of our application.
*/
const application = document.body.appendChild(document.createElement('div'))
application.id = 'application'

function Application () {
  return (
    <HashRouter hashType='noslash'>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
      </Switch>
    </HashRouter>
  )
}

/*
  Tell React to render our Application component into our root element (the
  "application" div we created above).
*/
ReactDOM.render((
  <ErrorBoundary>
    <StoreProvider>
      <Application />
    </StoreProvider>
  </ErrorBoundary>
), application)
