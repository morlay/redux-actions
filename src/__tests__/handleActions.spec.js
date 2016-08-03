import { expect } from '@morlay/tests';
import handleActions from '../handleActions';
import createAction from '../createAction';
import buildCreateAction from '../buildCreateAction';

describe(__filename, () => {
  describe('#handleActions', () => {
    it('reducer should change state correct', () => {
      const increment = createAction('increment');
      const DECREMENT = 'DECREMENT';

      const reducer = handleActions({
        [increment]: ({ counter }, amount) => ({
          counter: counter + amount,
        }),
        [DECREMENT]: ({ counter }, amount) => ({
          counter: counter - amount,
        }),
      });

      expect(reducer({ counter: 3 }, increment(7)))
        .to.eql({ counter: 10 });

      expect(reducer({ counter: 10 }, { type: DECREMENT, payload: 7 }))
        .to.deep.equal({ counter: 3 });
    });
  });

  context('when handle multi status action', () => {
    const typeWrappers = {
      default: (type) => type,
      success: (type) => `${type}_SUCCESS`,
      failed: (type) => `${type}_FAILED`,
    };

    const dispatchSuccess = (action) => ({
      ...action,
      type: `${action.type}_SUCCESS`,
    });

    it('reducer should change state correct', () => {
      const createMultiAction = buildCreateAction(typeWrappers);

      const increment = createMultiAction('increment');

      const reducer = handleActions({
        [increment.success]: ({ counter }, amount) => ({
          counter: counter + amount,
        }),
      });

      expect(reducer({ counter: 3 }, increment(3)))
        .to.eql({ counter: 3 });

      expect(reducer({ counter: 3 }, dispatchSuccess(increment(3))))
        .to.eql({ counter: 6 });
    });
  });
});
