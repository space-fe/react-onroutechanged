# An onRouteChanged wrapper for React components
[![Build Status](https://travis-ci.org/space-fe/react-onroutechanged.svg?branch=master)](https://travis-ci.org/space-fe/react-onroutechanged)

This is a React High Order Component(HOC) that you can use to handle the route changed events when you use [**react-router**](https://github.com/ReactTraining/react-router).

## Installation
Use `npm`
```shell
npm install react-onroutechanged
```
Use `yarn`
```shell
yarn add react-onroutechanged
```
## Usage
### ES6 Class Component
```javascript
import React from 'react'
import onRouteChangedHOC from 'react-onroutechanged'

class MyComponent extends React.Component {
  handleRouteChanged = (prevLocation, nextLocation) => {
    // ...do your stuff with location information here
  }
}

const onRoutedChangedConfig = {
  mounted: true,
  onlyPathname: false
}

export default onRouteChangedHOC(MyComponent, onRoutedChangedConfig)
```

### Functional Component with UseState Hook
```javascript
import React, { useState } from 'react'
import onRouteChangedHOC from 'react-onroutechanged'

const MyComponent = () => {
  const [location, setLocation] = useState()

  MyComponent.handleRouteChanged = (prevLocation, nextLocation) => {
    // ...do your stuff with location information here
    setLocation(nextLocation)
  }
}

const onRoutedChangedConfig = {
  mounted: true,
  onlyPathname: false
}

export default onRouteChangedHOC(MyComponent, onRoutedChangedConfig)
```

## Location Object
The `location` object has the following attributes:
* `location.pathname` - The path of the URL
* `location.search` - The URL query string
* `location.hash` - The URL hash fragment

**Notes**: This library is built on top of [react-router](!https://github.com/ReactTraining/react-router) [withRouter](!https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md) HOC and the location object passed to `handledRouteChanged` method is the exact same one provided by `withRouter` HOC, so you can look at [its documentation](!https://github.com/ReactTraining/history) for more information on the `location` object.
## Configuration
`onRouteChangedHOC` receives an optional configuration object as the second parameter. Allowed values for the configuration are as follows:

| Name           | Type      | Default | Description                                                                                                                                                                                                                             |
| -------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mounted`      | `boolean` | `false` | If `true`, the `handleRouteChanged` method of the wrappedComponent will be called with `(null, currentLocation)`when the component is mounted.                                                                                          |
| `onlyPathname` | `boolean` | `true`  | If `true`, the `handleRouteChanged` method will only be called when the `pathname` of the location has been changed. If `false`, the changes of `search` or `hash` of the `location` will also trigger the `handleRouteChanged` method. |