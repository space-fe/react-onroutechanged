import * as React from 'react'
import * as H from 'history';

declare function onRouteChangedHOC<T>(
  DecoratedComponent: React.ComponentType,
  config?: {
    mounted?: boolean
    onlyPathname?: boolean
    handleRouteChanged?: (
      prevLocation: H.Location,
      nextLocation: H.Location
    ) => void
  }
): React.ComponentType<T>

export default onRouteChangedHOC
