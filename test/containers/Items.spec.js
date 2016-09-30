import React from 'react';
import { shallow } from 'enzyme';

import { Items } from 'containers/Items';
import { appState } from 'reducers/app';
import { firebaseState } from 'reducers/firebase';

const mockDispatch = jest.fn();

function setup() {
  const props = {
    app: appState,
    dispatch: mockDispatch,
    firebase: firebaseState,
    location: {}
  };

  return shallow(<Items {...props} />);
}

describe('Items', () => {
  const wrapper = setup(true);

  it('should be a Component', () => {
    expect(wrapper.instance() instanceof React.Component).toBe(true);
  });

  it('should render properly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
