import {
  expect,
} from '@morlay/tests';

import {
  buildCreateAction,
  createAction,
  handleActions,
} from '../index';

const dispatchSuccess = (action) => ({
  ...action,
  type: `${action.type}_SUCCESS`,
});

describe(__filename, () => {
  context('examples', () => {
    it('reducer should change state correct', () => {
      const createMultiAction = buildCreateAction({
        success: (type) => `${type}_SUCCESS`,
        failed: (type) => `${type}_FAILED`,
      });

      const syncAction = createAction('syncAction');
      const asyncAction = createMultiAction('asyncAction');

      const reducer = handleActions({
        [syncAction]: ({ counter }, payload) => ({
          counter: payload,
        }),
        [asyncAction.success]: ({ counter }, payload) => ({
          counter: counter + payload,
        }),
      });

      expect(reducer({ counter: 3 }, dispatchSuccess(asyncAction(3))))
        .to.eql({ counter: 6 });

      expect(reducer({ counter: 3 }, syncAction(4)))
        .to.eql({ counter: 4 });
    });
  });
});
