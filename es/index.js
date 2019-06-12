import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

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
  var isReactComponent = DecoratedComponent.prototype.isReactComponent;

  var RouteChangedComponent =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(RouteChangedComponent, _React$Component);

    function RouteChangedComponent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, RouteChangedComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RouteChangedComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "__getHandleRouteChangedFunc", function () {
        var handleRouteChanged;

        if (!isReactComponent && typeof config.handleRouteChanged === 'function') {
          handleRouteChanged = config.handleRouteChanged;
        }

        if (isReactComponent && typeof _this.instanceRef.handleRouteChanged === 'function') {
          handleRouteChanged = _this.instanceRef.handleRouteChanged;
        }

        return handleRouteChanged;
      });

      _defineProperty(_assertThisInitialized(_this), "__routeChangedHandler", function (prevLocation, nextLocation) {
        var isSamePath = prevLocation.pathname === nextLocation.pathname;
        var isSameSearch = prevLocation.search === nextLocation.search;
        var isSameHash = prevLocation.hash === nextLocation.hash;

        var handleRouteChanged = _this.__getHandleRouteChangedFunc();

        if (!isSamePath) {
          return handleRouteChanged(prevLocation, nextLocation);
        }

        if (!config.onlyPathname && (!isSameHash || !isSameSearch)) {
          return handleRouteChanged(prevLocation, nextLocation);
        }
      });

      return _this;
    }

    _createClass(RouteChangedComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var handleRouteChanged = this.__getHandleRouteChangedFunc();

        if (typeof handleRouteChanged !== 'function') {
          throw new Error('WrappedComponent lacks a handleRouteChanged(prevLocation, currLocation) for processing route changed event.');
        }

        if (config.mounted) {
          // Since we have no idea what the previous route is when the component got mounted,
          // We will pass an null as the prevLocation param
          handleRouteChanged(null, this.props.location);
        }
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        var prevLocation = this.props.location;
        var nextLocation = nextProps.location;

        if (prevLocation === nextLocation) {
          return;
        }

        this.__routeChangedHandler(prevLocation, nextLocation);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var props = _extends({}, this.props);

        if (isReactComponent) {
          props.ref = function (ref) {
            _this2.instanceRef = ref;
          };
        }

        return React.createElement(DecoratedComponent, props);
      }
    }]);

    return RouteChangedComponent;
  }(React.Component);

  _defineProperty(RouteChangedComponent, "displayName", "OnRouteChanged(".concat(componentName, ")"));

  _defineProperty(RouteChangedComponent, "propTypes", {
    location: PropTypes.object.isRequired
  });

  return withRouter(RouteChangedComponent);
};

export default onRouteChangedHOC;
