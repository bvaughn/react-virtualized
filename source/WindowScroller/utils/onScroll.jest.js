import React from 'react';
import {mount} from 'enzyme';
import WindowScroller from '../WindowScroller';

function mockGetBoundingClientRectForHeader({
  documentOffset = 0,
  height,
  width,
}) {
  // Mock the WindowScroller element and window separately
  // The only way to mock the former (before its created) is globally
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    top: height,
    left: width,
  }));
  document.documentElement.getBoundingClientRect = jest.fn(() => ({
    top: documentOffset,
    left: documentOffset,
  }));
}

describe('onScroll', () => {
  // Issue: unregister runs first but because the scrollElement isnt checked it doesnt remove any
  // elements. This is because it purely does a referential check against the WindowScrollers
  // However, as soon as the `register` happens right after the unregister, the scrollElement matches
  // because we only have WindowScroller references.
  it('detach handlers if the scrollElement changes', () => {
    const generateDivWithMockedEventListeners = () => {
      let eventListeners = [];
      const addEventListenerMock = jest.fn(e => eventListeners.push(e));
      const removeEventListenerMock = jest.fn(
        e => (eventListeners = eventListeners.filter(el => el === e)),
      );

      const scrollElementDiv = document.createElement('div');
      scrollElementDiv.addEventListener = addEventListenerMock.bind(
        scrollElementDiv,
      );

      scrollElementDiv.removeEventListener = removeEventListenerMock.bind(
        scrollElementDiv,
      );

      return {
        element: scrollElementDiv,
        eventListeners,
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
      };
    };

    const firstElement = generateDivWithMockedEventListeners();
    const secondElement = generateDivWithMockedEventListeners();

    // JSDom doesn't implement a working getBoundingClientRect()
    // But WindowScroller requires it
    mockGetBoundingClientRectForHeader({
      documentOffset: 0,
      height: 0,
      width: 0,
    });

    // Initialise a single WindowScroller with the scrollElement as a div.
    const wrapper = mount(
      <WindowScroller scrollElement={firstElement.element}>
        {params => <div>&nbsp;</div>}
      </WindowScroller>,
    );

    const wrapper2 = mount(
      <WindowScroller scrollElement={firstElement.element}>
        {params => <div>&nbsp;</div>}
      </WindowScroller>,
    );

    expect(firstElement.addEventListener).toHaveBeenCalledTimes(2);

    // Simulate modify the props on the element
    wrapper.setProps({scrollElement: secondElement.element});
    wrapper2.setProps({scrollElement: secondElement.element});

    // scroll handler from onScroll & scroll handler from detectElementResize
    expect(
      firstElement.removeEventListener.mock.calls.filter(
        re => re[0] === 'scroll',
      ),
    ).toHaveLength(2);

    // And for a new event listener to be added to the second element
    expect(secondElement.addEventListener).toHaveBeenCalledTimes(2);
  });
});
