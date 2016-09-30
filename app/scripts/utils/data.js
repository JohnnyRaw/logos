import difference from 'lodash/difference';

/**
 * Find the symmetric difference between arrays
 * @param {Array} oldData
 * @param {Array} newData
 *
 * @returns {boolean|Object}
 */
export function diffArrays(oldData:Array, newData:Array):Object {
  if (!oldData || !newData) {
    throw new Error('missing parameters');
  }

  const added = difference(newData, oldData);
  const removed = difference(oldData, newData);

  if (!added.length && !removed.length) {
    return false;
  }

  return {
    added,
    removed
  };
}
