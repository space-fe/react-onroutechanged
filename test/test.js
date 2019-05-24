import OnRouteChangedHOC from '../src/index'
import React from 'react'
import cases from 'jest-in-case'

// Test data
const getLocation = (pathname, search, hash) => ({ pathname, search, hash })
const l1 = getLocation('p1', 's1', 'h1')
const l2 = getLocation('p1', 's1', 'h2')
const l3 = getLocation('p1', 's2', 'h1')
const l4 = getLocation('p2', 's1', 'h1')

class Component extends React.Component {
  render () {
    return <div>test</div>
  }
}

const FuncComponent = function() {
  return <div>test</div>
}

let handleRouteChangedFunc

cases('test in normal', opts => {
  // Resets handleRouteChangedFunc to a fresh mock func
  handleRouteChangedFunc = jest.fn()
  let TestComponent

  if (opts.isReactComponent) {
    Component.prototype.handleRouteChanged = handleRouteChangedFunc
    TestComponent = OnRouteChangedHOC(Component, opts.config)
  } else {
    FuncComponent.handleRouteChanged = handleRouteChangedFunc
    TestComponent = OnRouteChangedHOC(FuncComponent, {
      ...opts.config,
      handleRouteChanged: FuncComponent.handleRouteChanged
    })
  }
 
  const wrapper = mount(<TestComponent
    location={opts.locations[0]}
  />)
  for (let i = 1; i < opts.locations.length; i++) {
    wrapper.setProps({ location: opts.locations[i] })
  }

  expect(handleRouteChangedFunc)
  .toHaveBeenCalledTimes(opts.calledTime)

  if (opts.calledParams) {
    expect(handleRouteChangedFunc)
      .toHaveBeenCalledWith(...opts.calledParams)
  }

  Component.prototype.handleRouteChanged = undefined
}, [
  {
    name: 'should not call handleRouteChanged function when class component is mounted if config.mounted=false',
    locations: [l1],
    isReactComponent: true,
    calledTime: 0,
    config: undefined
  },
  {
    name: 'should not call handleRouteChanged function when functional component is mounted if config.mounted=false',
    locations: [l1],
    isReactComponent: false,
    calledTime: 0,
    config: undefined
  },
  {
    name: 'should call handleRouteChanged function when class component is mounted if config.mounted=true',
    locations: [l1],
    isReactComponent: true,
    calledTime: 1,
    config: { mounted: true },
    calledParams: [null, l1]
  },
  {
    name: 'should call handleRouteChanged function when functional component is mounted if config.mounted=true',
    locations: [l1],
    isReactComponent: false,
    calledTime: 1,
    config: { mounted: true },
    calledParams: [null, l1]
  },
  {
    name: 'should call handleRouteChanged when class component pathname is changed',
    locations: [l1, l4],
    isReactComponent: true,
    calledTime: 1,
    calledParams: [l1, l4]
  },
  {
    name: 'should call handleRouteChanged when functional component pathname is changed',
    locations: [l1, l4],
    isReactComponent: false,
    calledTime: 1,
    calledParams: [l1, l4]
  },
  {
    name: 'should not call handleRouteChanged function when class component pathname is not changed if config.onlyPathname=true',
    locations: [l1, l2],
    isReactComponent: true,
    calledTime: 0,
    config: { onlyPathname: true }
  },
  {
    name: 'should not call handleRouteChanged function when functional component pathname is not changed if config.onlyPathname=true',
    locations: [l1, l2],
    isReactComponent: false,
    calledTime: 0,
    config: { onlyPathname: true }
  },
  {
    name: 'should call handleRouteChanged function when class component pathname is not changed but hash has changed if config.onlyPathname=false',
    locations: [l1, l2],
    isReactComponent: true,
    calledTime: 1,
    config: { onlyPathname: false },
    calledParams: [l1, l2]
  },
  {
    name: 'should call handleRouteChanged function when functional component pathname is not changed but hash has changed if config.onlyPathname=false',
    locations: [l1, l2],
    isReactComponent: false,
    calledTime: 1,
    config: { onlyPathname: false },
    calledParams: [l1, l2]
  },
  {
    name: 'should call handleRouteChanged function when class component pathname is not changed but search has changed if config.onlyPathname=false',
    locations: [l1, l3],
    isReactComponent: true,
    calledTime: 1,
    config: { onlyPathname: false },
    calledParams: [l1, l3]
  },
  {
    name: 'should call handleRouteChanged function when functional component pathname is not changed but search has changed if config.onlyPathname=false',
    locations: [l1, l3],
    isReactComponent: false,
    calledTime: 1,
    config: { onlyPathname: false },
    calledParams: [l1, l3]
  },
  {
    name: 'should not call handleRouteChanged function when class component location is not changed',
    locations: [l1, l1],
    isReactComponent: true,
    calledTime: 0
  },
  {
    name: 'should not call handleRouteChanged function when functional component location is not changed',
    locations: [l1, l1],
    isReactComponent: false,
    calledTime: 0
  }
])
