import { diffArrays } from 'utils/data';

describe('data/diffArrays', () => {
  it('should return false for equal arrays', () => {
    expect(diffArrays([0, 1, 2], [0, 1, 2])).toBe(false);
  });

  it('should return the added items', () => {
    expect(diffArrays([0, 1, 2], [0, 1, 2, 5])).toEqual({ added: [5], removed: [] });
  });

  it('should return the removed items', () => {
    expect(diffArrays([0, 1, 2], [0, 1])).toEqual({ added: [], removed: [2] });
  });
});
