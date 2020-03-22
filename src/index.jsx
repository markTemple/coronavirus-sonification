import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'

import { Home } from './views/home'
import { useServer } from './utilities/client'
import { ErrorBoundary } from './components/error-boundary'
import { StoreProvider } from './store'
import { Genome } from './views/genome'

/*
  Create a div element in the DOM with the ID: "application". This element will
  be the root of our application.
*/
const application = document.body.appendChild(document.createElement('div'))
application.id = 'application'

function Application () {
  const isSuccessful = useServer()

  if (isSuccessful === false) throw new Error('Failed to connect to server.')
  if (isSuccessful === null) return (
    <h1>Connecting to server...</h1>
  )

  return (
    <HashRouter hashType='noslash'>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/genome'>
          <Genome />
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
