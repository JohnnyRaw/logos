const mockAuth = jest.fn();
const mockDatabase = jest.fn();

jest.mock('firebase');

const firebaseClient = require('utils/firebaseClient');

describe('firebase/signInWithPopup', () => {
  it('should fail to signInWithPopup', async() => {
    try {
      await firebaseClient.signInWithPopup('github');
    }
    catch (error) {
      expect(error.message).toBe("Cannot read property 'signInWithPopup' of undefined");
    }
  });
});
