import createRoutes from 'routes';
import { ActionTypes, XHR } from 'constants/index';

jest.mock('expose?$!expose?jQuery!jquery', () => {});
jest.mock('bootstrap/js/dist/modal', () => {});
jest.mock('footable/compiled/footable', () => {});

require('main');

describe('Constants:ActionTypes', () => {
  it('should match the snapshot', () => {
    expect(ActionTypes).toMatchSnapshot();
  });
});


describe('Constants:XHR', () => {
  it('should match the snapshot', () => {
    expect(XHR).toMatchSnapshot();
  });
});

describe('Routes', () => {
  it('should match the snapshot', () => {
    const routes = createRoutes();
    expect(routes.props.children.length).toMatchSnapshot();
  });
});
