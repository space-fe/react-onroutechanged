
import React from 'react'

declare class RouteChangedComponent extends React.Component {}

declare type LocationObject = {
  pathname: string
  search: string
  hash: string
}

declare function onRouteChangedHOC(
  DecoratedComponent: React.Component | Function,
  config?: {
    mounted: boolean
    onlyPathname: boolean
    handleRouteChanged: (
      prevLocation: LocationObject,
      nextLocation: LocationObject
    ) => void
  }
): RouteChangedComponent

export default onRouteChangedHOC
