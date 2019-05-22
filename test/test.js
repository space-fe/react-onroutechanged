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
let handleRouteChangedFunc

cases('test in case', opts => {
  // Resets handleRouteChangedFunc to a fresh mock func
  handleRouteChangedFunc = jest.fn()
  Component.prototype.handleRouteChanged = handleRouteChangedFunc

  const TestComponent = OnRouteChangedHOC(Component, opts.config)
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
}, [
  {
    name: 'should not call handleRouteChanged function when component is mounted if config.mounted=false',
    locations: [l1],
    calledTime: 0,
    config: undefined
  },
  {
    name: 'should call handleRouteChanged function when component is mounted if config.mounted=true',
    locations: [l1],
    calledTime: 1,
    config: { mounted: true },
    calledParams: [null, l1]
  },
  {
    name: 'should call handleRouteChanged when pathname is changed',
    locations: [l1, l4],
    calledTime: 1,
    calledParams: [l1, l4]
  },
  {
    name: 'should not call handleRouteChanged function when pathname is not changed if config.onlyPathname=true',
    locations: [l1, l2],
    calledTime: 0,
    config: { onlyPathname: true }
  },
  {
    name: 'should call handleRouteChanged function when pathname is not changed but hash has changed if config.onlyPathname=false',
    locations: [l1, l2],
    calledTime: 1,
    config: { onlyPathname: false },
    calledParams: [l1, l2]
  },
  {
    name: 'should call handleRouteChanged function when pathname is not changed but search has changed if config.onlyPathname=false',
    locations: [l1, l3],
    calledTime: 1,
    config: { onlyPathname: false },
    calledParams: [l1, l3]
  }
])
