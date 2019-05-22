import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

/**
 * This function generates the HOC function that will call
 * the handleRoutedChanged function of the DecoratedComponent instance
 * when the route of the browser has been changed.
 */
const onRouteChangedHOC = (DecoratedComponent, config = { mounted: false, onlyPathname: true }) => {
  config.mounted = config.mounted === undefined ? false : config.mounted
  config.onlyPathname = config.onlyPathname === undefined ? true : config.onlyPathname

  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'

  class RouteChangedComponent extends React.Component {
    static displayName = `OnRouteChanged(${componentName})`

    static propTypes = {
      location: PropTypes.object.isRequired
    }

    componentDidMount () {
      if (typeof this.instanceRef.handleRouteChanged !== 'function') {
        throw new Error(
          'WrappedComponent lacks a handleRouteChanged(prevLocation, currLocation) for processing route changed event.'
        )
      }

      if (config.mounted) {
        // Since we have no idea what the previous route is when the component got mounted,
        // We will pass an null as the prevLocation param
        this.instanceRef.handleRouteChanged(null, this.props.location)
      }
    }

    __routeChangedHandler = (prevLocation, nextLocation) => {
      const isSamePath = prevLocation.pathname === nextLocation.pathname
      const isSameSearch = prevLocation.search === nextLocation.search
      const isSameHash = prevLocation.hash === nextLocation.hash

      if (!isSamePath) {
        return this.instanceRef.handleRouteChanged(prevLocation, nextLocation)
      }

      if (!config.onlyPathname && (!isSameHash || !isSameSearch)) {
        return this.instanceRef.handleRouteChanged(prevLocation, nextLocation)
      }
    }

    componentWillReceiveProps (nextProps) {
      const prevLocation = this.props.location
      const nextLocation = nextProps.location

      if (prevLocation === nextLocation) {
        return
      }

      this.__routeChangedHandler(prevLocation, nextLocation)
    }

    render () {
      return <DecoratedComponent
        ref={ref => { this.instanceRef = ref }}
        {...this.props}
      />
    }
  }

  return withRouter(RouteChangedComponent)
}

export default onRouteChangedHOC
