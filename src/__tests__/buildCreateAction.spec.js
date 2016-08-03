import { expect } from '@morlay/tests';
import buildCreateAction, { createMultiTypeGetter } from '../buildCreateAction';

const typeWrappers = {
  default: (type) => type,
  success: (type) => `${type}_SUCCESS`,
  failed: (type) => `${type}_FAILED`,
};

describe(__filename, () => {
  describe('#createMultiTypeGetter', () => {
    it('should return multiple type getters by type wrappers', () => {
      const typeGetter = createMultiTypeGetter(typeWrappers)('ACTION_TYPE');

      expect(typeGetter.toString()).to.eql('ACTION_TYPE');

      expect(typeGetter.success.toString()).to.eql('ACTION_TYPE_SUCCESS');

      expect(typeGetter.failed.toString()).to.eql('ACTION_TYPE_FAILED');
    });
  });

  describe('#buildCreateAction', () => {
    it('should get workable createAction ', () => {
      const createMultiAction = buildCreateAction(typeWrappers);

      const someAction = createMultiAction('ACTION_TYPE');

      expect(someAction.toString()).to.eql('ACTION_TYPE');

      expect(someAction.success.toString()).to.eql('ACTION_TYPE_SUCCESS');

      expect(someAction.failed.toString()).to.eql('ACTION_TYPE_FAILED');
    });

    it('should get workable createAction with payload creator', () => {
      const createMultiAction = buildCreateAction(typeWrappers);

      const createRequestAction = (actionType, requestCreator, metaCreator) =>
        createMultiAction(actionType, (...args) => ({
          request: requestCreator(...args),
        }), metaCreator);

      const someRequest = createRequestAction('ACTION_TYPE', (data) => ({ url: '/test', data }));

      expect(someRequest({
        key: 'key',
      })).to.eql({
        type: 'ACTION_TYPE',
        payload: {
          request: {
            url: '/test',
            data: {
              key: 'key',
            },
          },
        },
      });
    });
  });
});
