import React from 'react';
import { mount } from 'enzyme';

import Header from 'components/Header';
import { appState } from 'reducers/app';

const mockDispatch = jest.fn();

function setup() {
  const props = {
    app: appState,
    dispatch: mockDispatch,
    location: {
      pathname: '/'
    }
  };

  return mount(<Header {...props} />);
}

describe('Header', () => {
  const wrapper = setup();

  it('should be a Component', () => {
    expect(wrapper.instance() instanceof React.Component).toBe(true);
  });

  it('should render properly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should handle clicks', () => {
    wrapper.find('.app__header__logo').simulate('click');
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: '@@router/CALL_HISTORY_METHOD',
      payload: { method: 'push', args: [{ pathname: '/', search: undefined, state: undefined }] }
    });
  });
});

