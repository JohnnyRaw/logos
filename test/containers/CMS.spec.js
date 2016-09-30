import React from 'react';
import { shallow } from 'enzyme';

import { CMS } from 'containers/CMS';
import { firebaseState } from 'reducers/firebase';

function setup() {
  const props = {
    firebase: firebaseState,
    dispatch: () => {},
    location: {},
    user: {
      isAdmin: true
    }
  };

  return shallow(<CMS {...props} />);
}

describe('CMS', () => {
  const wrapper = setup(true);

  it('should be a Component', () => {
    expect(wrapper.instance() instanceof React.Component).toBe(true);
  });

  it('should render properly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
