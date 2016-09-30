const mockSignInWithPopup = jest.fn();
const mockSignInWithCredential = jest.fn();
const mockConnectRoles = jest.fn();
const mockSignOut = jest.fn();

jest.mock('utils/firebaseClient', () =>
  ({
    connectRoles: mockConnectRoles,
    signInWithCredential: mockSignInWithCredential,
    signInWithPopup: mockSignInWithPopup,
    signOut: mockSignOut
  })
);

const { login, logout } = require('sagas/user');

describe('user', () => {
  it('login saga', () => {
    const generator = login({ payload: { provider: 'github' } });

    expect(generator.next().value).toMatchSnapshot();
    expect(generator.next({
      credential: {},
      user: {}
    }).value).toMatchSnapshot();
    expect(generator.next().value).toMatchSnapshot();
    expect(generator.next().value).toMatchSnapshot();
    expect(generator.next().done).toBe(true);
  });

  it('logout saga', () => {
    const generator = logout();

    expect(generator.next().value).toMatchSnapshot();
    expect(generator.next().value).toMatchSnapshot();
    expect(generator.next().value).toMatchSnapshot();
    expect(generator.next().done).toBe(true);
  });
});
