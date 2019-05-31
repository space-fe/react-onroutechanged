import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/**
 * This function generates the HOC function that will call
 * the handleRoutedChanged function of the DecoratedComponent instance
 * when the route of the browser has been changed.
 */

const onRouteChangedHOC = (DecoratedComponent, config = {
  mounted: false,
  onlyPathname: true
}) => {
  config.mounted = config.mounted === undefined ? false : config.mounted;
  config.onlyPathname = config.onlyPathname === undefined ? true : config.onlyPathname;
  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';
  const isReactComponent = DecoratedComponent.prototype.isReactComponent;

  class RouteChangedComponent extends React.Component {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "__getHandleRouteChangedFunc", () => {
        let handleRouteChanged;

        if (!isReactComponent && typeof config.handleRouteChanged === 'function') {
          handleRouteChanged = config.handleRouteChanged;
        }

        if (isReactComponent && typeof this.instanceRef.handleRouteChanged === 'function') {
          handleRouteChanged = this.instanceRef.handleRouteChanged;
        }

        return handleRouteChanged;
      });

      _defineProperty(this, "__routeChangedHandler", (prevLocation, nextLocation) => {
        const isSamePath = prevLocation.pathname === nextLocation.pathname;
        const isSameSearch = prevLocation.search === nextLocation.search;
        const isSameHash = prevLocation.hash === nextLocation.hash;

        const handleRouteChanged = this.__getHandleRouteChangedFunc();

        if (!isSamePath) {
          return handleRouteChanged(prevLocation, nextLocation);
        }

        if (!config.onlyPathname && (!isSameHash || !isSameSearch)) {
          return handleRouteChanged(prevLocation, nextLocation);
        }
      });
    }

    componentDidMount() {
      const handleRouteChanged = this.__getHandleRouteChangedFunc();

      if (typeof handleRouteChanged !== 'function') {
        throw new Error('WrappedComponent lacks a handleRouteChanged(prevLocation, currLocation) for processing route changed event.');
      }

      if (config.mounted) {
        // Since we have no idea what the previous route is when the component got mounted,
        // We will pass an null as the prevLocation param
        handleRouteChanged(null, this.props.location);
      }
    }

    componentWillReceiveProps(nextProps) {
      const prevLocation = this.props.location;
      const nextLocation = nextProps.location;

      if (prevLocation === nextLocation) {
        return;
      }

      this.__routeChangedHandler(prevLocation, nextLocation);
    }

    render() {
      let props = _extends({}, this.props);

      if (isReactComponent) {
        props.ref = ref => {
          this.instanceRef = ref;
        };
      }

      return React.createElement(DecoratedComponent, props);
    }

  }

  _defineProperty(RouteChangedComponent, "displayName", `OnRouteChanged(${componentName})`);

  _defineProperty(RouteChangedComponent, "propTypes", {
    location: PropTypes.object.isRequired
  });

  return withRouter(RouteChangedComponent);
};

export default onRouteChangedHOC;
