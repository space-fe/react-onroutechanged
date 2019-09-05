import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

const { useEffect, useRef } = React

/**
 * This function generates the HOC function that will call
 * the handleRoutedChanged function of the DecoratedComponent instance
 * when the route of the browser has been changed.
 */
const onRouteChangedHOC = (DecoratedComponent, config = { mounted: false, onlyPathname: true }) => {
  config.mounted = config.mounted === undefined ? false : config.mounted
  config.onlyPathname = config.onlyPathname === undefined ? true : config.onlyPathname

  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'
  const isReactComponent = DecoratedComponent.prototype && DecoratedComponent.prototype.isReactComponent

  const RouteChangedComponent = (props) => {
    const { location } = props
    const prevLocationRef = useRef(location)
    const instanceRef = useRef(null)

    const __getHandleRouteChangedFunc = () => {
      let handleRouteChanged

      if (!isReactComponent && typeof config.handleRouteChanged === 'function') {
        handleRouteChanged = config.handleRouteChanged
      }

      if (isReactComponent && typeof instanceRef.current.handleRouteChanged === 'function') {
        handleRouteChanged = instanceRef.current.handleRouteChanged
      }

      return handleRouteChanged
    }

    const __routeChangedHandler = (prevLocation, nextLocation) => {
      const isSamePath = prevLocation.pathname === nextLocation.pathname
      const isSameSearch = prevLocation.search === nextLocation.search
      const isSameHash = prevLocation.hash === nextLocation.hash

      const handleRouteChanged = __getHandleRouteChangedFunc()

      if (!isSamePath) {
        return handleRouteChanged(prevLocation, nextLocation)
      }

      if (!config.onlyPathname && (!isSameHash || !isSameSearch)) {
        return handleRouteChanged(prevLocation, nextLocation)
      }
    }

    useEffect(() => {
      const handleRouteChanged = __getHandleRouteChangedFunc()

      if (typeof handleRouteChanged !== 'function') {
        throw new Error(
          'WrappedComponent lacks a handleRouteChanged(prevLocation, currLocation) for processing route changed event.'
        )
      }
      if (config.mounted) {
        // Since we have no idea what the previous route is when the component got mounted,
        // We will pass an null as the prevLocation param
        handleRouteChanged(null, location)
      }
    }, [])

    useEffect(() => {
      prevLocationRef.current = location
    })
    const preLocation = prevLocationRef.current

    useEffect(() => {
      __routeChangedHandler(preLocation, location)
    }, [props.location])

    if (isReactComponent) {
      return <DecoratedComponent ref={instanceRef} {...props} />
    } else {
      return <DecoratedComponent {...props} />
    }
  }

  RouteChangedComponent.propTypes = {
    location: PropTypes.object.isRequired
  }
  RouteChangedComponent.displayName = `OnRouteChanged(${componentName})`

  return withRouter(RouteChangedComponent)
}

export default onRouteChangedHOC
