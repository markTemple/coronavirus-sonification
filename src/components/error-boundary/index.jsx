import React, { Component } from 'react'

export class ErrorBoundary extends Component {
  static getDerivedStateFromError () {
    return { hasError: true }
  }

  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    console.error(error)
    console.error(info.componentStack)
  }

  render () {
    if (this.state.hasError) return (
      <h1>Whoops, something went wrong...</h1>
    )
    return this.props.children
  }
}
