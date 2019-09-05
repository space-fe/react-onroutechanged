import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

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

var useEffect = React.useEffect,
    useRef = React.useRef;
/**
 * This function generates the HOC function that will call
 * the handleRoutedChanged function of the DecoratedComponent instance
 * when the route of the browser has been changed.
 */

var onRouteChangedHOC = function onRouteChangedHOC(DecoratedComponent) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    mounted: false,
    onlyPathname: true
  };
  config.mounted = config.mounted === undefined ? false : config.mounted;
  config.onlyPathname = config.onlyPathname === undefined ? true : config.onlyPathname;
  var componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';
  var isReactComponent = DecoratedComponent.prototype && DecoratedComponent.prototype.isReactComponent;

  var RouteChangedComponent = function RouteChangedComponent(props) {
    var location = props.location;
    var prevLocationRef = useRef(location);
    var instanceRef = useRef(null);

    var __getHandleRouteChangedFunc = function __getHandleRouteChangedFunc() {
      var handleRouteChanged;

      if (!isReactComponent && typeof config.handleRouteChanged === 'function') {
        handleRouteChanged = config.handleRouteChanged;
      }

      if (isReactComponent && typeof instanceRef.current.handleRouteChanged === 'function') {
        handleRouteChanged = instanceRef.current.handleRouteChanged;
      }

      return handleRouteChanged;
    };

    var __routeChangedHandler = function __routeChangedHandler(prevLocation, nextLocation) {
      var isSamePath = prevLocation.pathname === nextLocation.pathname;
      var isSameSearch = prevLocation.search === nextLocation.search;
      var isSameHash = prevLocation.hash === nextLocation.hash;

      var handleRouteChanged = __getHandleRouteChangedFunc();

      if (!isSamePath) {
        return handleRouteChanged(prevLocation, nextLocation);
      }

      if (!config.onlyPathname && (!isSameHash || !isSameSearch)) {
        return handleRouteChanged(prevLocation, nextLocation);
      }
    };

    useEffect(function () {
      var handleRouteChanged = __getHandleRouteChangedFunc();

      if (typeof handleRouteChanged !== 'function') {
        throw new Error('WrappedComponent lacks a handleRouteChanged(prevLocation, currLocation) for processing route changed event.');
      }

      if (config.mounted) {
        // Since we have no idea what the previous route is when the component got mounted,
        // We will pass an null as the prevLocation param
        handleRouteChanged(null, location);
      }
    }, []);
    useEffect(function () {
      prevLocationRef.current = location;
    });
    var preLocation = prevLocationRef.current;
    useEffect(function () {
      __routeChangedHandler(preLocation, location);
    }, [props.location]);

    if (isReactComponent) {
      return React.createElement(DecoratedComponent, _extends({
        ref: instanceRef
      }, props));
    } else {
      return React.createElement(DecoratedComponent, props);
    }
  };

  RouteChangedComponent.propTypes = {
    location: PropTypes.object.isRequired
  };
  RouteChangedComponent.displayName = "OnRouteChanged(".concat(componentName, ")");
  return withRouter(RouteChangedComponent);
};

export default onRouteChangedHOC;
